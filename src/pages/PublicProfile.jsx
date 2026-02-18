import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaUser, FaCheck, FaMapMarkerAlt, FaCommentDots } from 'react-icons/fa';
import GigCard from '../components/GigCard';
import { useAuth } from '../context/AuthContext';

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [userGigs, setUserGigs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch User Details
                // We need an endpoint to get user by ID publicly. 
                // Currently userController might not have a public 'getUserById' that returns full profile without auth or tailored for public view.
                // Assuming we will add/use `GET /api/users/:id`
                const userRes = await axios.get(`/api/users/${id}`);
                setUser(userRes.data);

                // Fetch User's Gigs
                const gigsRes = await axios.get(`/api/gigs?userId=${id}`);
                setUserGigs(gigsRes.data);
            } catch (err) {
                console.error("Failed to fetch user data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleContact = async () => {
        if (!currentUser) {
            navigate("/login");
            return;
        }

        try {
            const res = await axios.post("/api/conversations/", { to: user._id });
            navigate(`/message/${res.data.id}`);
        } catch (err) {
            if (err.response && err.response.status === 200) {
                navigate(`/message/${err.response.data.id}`);
            }
            console.log(err);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center dark:text-white">Loading...</div>;
    if (loading) return <div className="min-h-screen flex items-center justify-center dark:text-white">Loading...</div>;
    if (!user) return (
        <div className="min-h-screen flex flex-col items-center justify-center dark:text-white gap-4">
            <h2 className="text-xl font-bold">User not found</h2>
            <p className="text-gray-500">Requested User ID: {id}</p>
            <p className="text-sm text-red-500">Please check console for details.</p>
            <button onClick={() => navigate("/")} className="text-primary underline">Go Home</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 font-sans text-gray-800 dark:text-white">
            <div className="container mx-auto px-4 lg:px-8">

                {/* Profile Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                    <img
                        src={user.profile?.profilePicture || "https://ui-avatars.com/api/?name=" + user.username}
                        alt={user.username}
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow-sm"
                    />

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{user.username}</h1>
                            <p className="text-gray-500 font-medium">{user.profile?.shortDesc || "Freelancer at Workora"}</p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-1">
                                <FaMapMarkerAlt className="text-gray-400" />
                                <span>{user.country || "Global"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaUser className="text-gray-400" />
                                <span>Member since {new Date(user.createdAt).getFullYear()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaStar className="text-yellow-500" />
                                <span className="font-bold text-gray-900 dark:text-white">5.0</span>
                                <span className="text-gray-400">(25 reviews)</span>
                                {/* Note: Real stats would need to be aggregated in backend */}
                            </div>
                        </div>

                        {currentUser?._id !== user._id && (
                            <button
                                onClick={handleContact}
                                className="bg-primary hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-md transition flex items-center gap-2 mx-auto md:mx-0"
                            >
                                <FaCommentDots /> Contact Me
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: About & Skills */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-xl font-bold mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">About Me</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {user.profile?.bio || "No bio added yet."}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-xl font-bold mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.profile?.skills && user.profile.skills.length > 0 ? (
                                    user.profile.skills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 italic">No skills listed</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Gigs */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-6">My Gigs</h2>
                        {userGigs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {userGigs.map(gig => (
                                    <GigCard key={gig._id} gig={gig} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500 italic">
                                No active gigs found.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PublicProfile;
