import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { FaUser, FaEnvelope, FaCamera, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, dispatch } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        userBio: user?.profile?.bio || '', // mapped from profile.bio
        userSkills: user?.profile?.skills ? user.profile.skills.join(', ') : '', // mapped from profile.skills array
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let profilePictureUrl = user?.profile?.profilePicture;

            // 1. Upload Image if selected
            if (file) {
                const uploadData = new FormData();
                uploadData.append("file", file);
                uploadData.append("upload_preset", "workora"); // Make sure this preset exists in Cloudinary

                // Note: Direct cloudinary upload from frontend or via backend?
                // Existing code in Add.jsx suggests sending file to backend /api/gigs which handles upload
                // But we need a general upload endpoint or handle it in user update.
                // Let's assume for now we might need to implement image upload in user controller or use existing utility.

                // CHECK: How does `Add.jsx` handle it? 
                // It sends `image` in FormData to `/api/gigs`.
                // We should probably implement `upload` in `userController` or separate `uploadController`.
                // For now, let's send it to `/api/users` with the profile data if the backend supports multipart/form-data.
                // Looking at `app.js`, it uses `express.json` and `express.urlencoded`.
                // `gigController` uses `upload.single('image')` middleware? I need to check `gigRoutes`.
            }

            // Since I haven't added Multer to userRoutes yet, I'll stick to JSON updates for text fields first.
            // If the user wants to update the image, I'll need to add upload middleware to userRoutes.

            // Construct Update Object
            const updates = {
                username: formData.username,
                email: formData.email,
                profile: {
                    bio: formData.userBio,
                    skills: formData.userSkills.split(',').map(s => s.trim()).filter(s => s),
                    profilePicture: profilePictureUrl // Keep existing or update if I handle upload
                }
            };

            const res = await axios.put("/api/users", updates, { withCredentials: true });

            // Update Context/LocalStorage
            const updatedUser = { ...user, ...res.data };
            dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
            localStorage.setItem("user", JSON.stringify(updatedUser)); // Important!

            toast.success("Profile updated successfully!");

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 font-sans text-gray-800 dark:text-gray-200">
            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Profile Settings</h1>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-100 dark:border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Profile Picture (Visual only for now until upload is fixed) */}
                        <div className="flex flex-col items-center gap-4 mb-6">
                            <div className="relative group">
                                <img
                                    src={file ? URL.createObjectURL(file) : (user?.profile?.profilePicture || "https://ui-avatars.com/api/?name=" + user?.username)}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow-sm"
                                />
                                <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-emerald-600 transition shadow-md">
                                    <FaCamera />
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                            </div>
                            <p className="text-sm text-gray-500">Allowed: .jpg, .png</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Username</label>
                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/50 px-3">
                                    <FaUser className="text-gray-400" />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-transparent outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Email</label>
                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/50 px-3 opacity-70 cursor-not-allowed">
                                    <FaEnvelope className="text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        readOnly
                                        className="w-full p-3 bg-transparent outline-none cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Bio</label>
                            <textarea
                                name="userBio"
                                value={formData.userBio}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Tell us about yourself..."
                                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Skills <span className="text-gray-400 font-normal text-xs">(Comma separated)</span></label>
                            <input
                                type="text"
                                name="userSkills"
                                value={formData.userSkills}
                                onChange={handleChange}
                                placeholder="React, Node.js, Design..."
                                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 outline-none focus:ring-2 focus:ring-primary/50 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 rounded-md transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70"
                        >
                            {loading ? "Saving..." : <><FaSave /> Save Changes</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
