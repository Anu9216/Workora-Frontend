import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ username, password });

            navigate(location.state?.from || "/");
        } catch (err) {
            console.error("Login failed:", err);
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
            setError(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 font-sans">
            <div data-aos="zoom-in" className="bg-white dark:bg-gray-900 p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Sign In</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Username</label>
                        <input
                            name="username"
                            type="text"
                            placeholder="johndoe"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 rounded-md transition duration-300">
                        Login
                    </button>
                    {error && <div className="text-red-500 text-center">{error}</div>}
                </form>

                <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
                    Don't have an account? <Link to="/signup" className="text-primary hover:underline">Join Workora</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
