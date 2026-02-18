import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Signup = () => {
    const [file, setFile] = useState(null);
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        country: "",
        phone: "",
        isSeller: false,
    });
    const [error, setError] = useState(null);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSellerChange = (e) => {
        setUser((prev) => ({ ...prev, isSeller: e.target.checked }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const upload = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "workora"); // Must match backend/cloudinary config
        try {
            // Mock Upload if proxy isn't setting up cloud correctly yet, or use real Cloudinary URL
            // For now assuming the backend handles it or we upload directly to Cloudinary
            // Simplified: Just returning a mock URL or real upload if backend supports it
            // Ideally: await axios.post("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", data);

            // For this implementation, we'll assume the backend Handles 'img' field string or we just pass a placeholder
            return "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let url = "";
        if (file) {
            url = await upload(file);
        }

        try {
            await register({ ...user, img: url, role: user.isSeller ? 'freelancer' : 'client' });
            navigate("/");
        } catch (err) {
            console.log(err);
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong during registration.";
            setError(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 font-sans py-10">
            <div data-aos="fade-up" className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-10">

                {/* Left Column: Account Info */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-6">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Create a new account</h1>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Username</label>
                        <input
                            name="username"
                            type="text"
                            placeholder="johndoe"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="email@example.com"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Profile Picture</label>
                        <input
                            type="file"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none dark:bg-gray-700 dark:text-white"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Country</label>
                        <input
                            name="country"
                            type="text"
                            placeholder="USA"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 rounded-md transition duration-300">
                        Register
                    </button>
                    {error && <div className="text-red-500 text-center text-sm">{error}</div>}
                </form>

                {/* Right Column: Seller Info */}
                <div className="flex-1 space-y-6">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">I want to become a seller</h1>

                    <div className="flex items-center gap-4 mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" onChange={handleSellerChange} checked={user.isSeller} />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                            <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300">
                                {user.isSeller ? "Seller Account Active ✅" : "Activate Seller Account"}
                            </span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Phone Number</label>
                        <input
                            name="phone"
                            type="text"
                            placeholder="+1 234 567 89"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Description</label>
                        <textarea
                            placeholder="A short description of yourself"
                            name="desc"
                            cols="30"
                            rows="10"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-primary resize-none dark:bg-gray-700 dark:text-white"
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Signup;
