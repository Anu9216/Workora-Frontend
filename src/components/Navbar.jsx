import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { FaSun, FaMoon, FaSearch, FaBars } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categories = [
        "Graphics & Design", "Digital Marketing", "Writing & Translation",
        "Video & Animation", "Music & Audio", "Programming & Tech",
        "Business", "Lifestyle", "AI Services"
    ];

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 ${isScrolled ? 'shadow-md py-4' : 'py-5'}`}>
                <div className="container mx-auto px-6">
                    {/* Top Row: Logo, Search, Actions */}
                    <div className="flex justify-between items-center gap-8">

                        {/* Logo */}
                        <Link to="/" className="text-3xl font-display font-black tracking-tighter text-gray-900 dark:text-white flex shrink-0 items-center gap-1">
                            Workora<span className="text-primary text-4xl leading-none">.</span>
                        </Link>

                        {/* Search Bar (Hidden on mobile) */}
                        <div className="hidden md:flex flex-grow max-w-2xl relative group">
                            <div className="flex w-full border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                                <input
                                    type="text"
                                    placeholder="What service are you looking for today?"
                                    className="w-full px-4 py-2.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 outline-none"
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') navigate(`/gigs?search=${input}`);
                                    }}
                                />
                                <button
                                    onClick={() => navigate(`/gigs?search=${input}`)}
                                    className="bg-gray-900 dark:bg-gray-700 text-white px-6 py-2 hover:bg-primary hover:text-white transition-colors duration-300"
                                >
                                    <FaSearch />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-6 shrink-0">


                            <nav className="hidden lg:flex items-center gap-6 font-medium text-gray-600 dark:text-gray-300">
                                <Link to="/gigs" className="hover:text-primary transition">Explore</Link>
                                {!user && <Link to="/login" className="hover:text-primary transition">Sign In</Link>}
                                {user ? (
                                    <div className="flex items-center gap-3">
                                        <Link to="/dashboard" className="hover:text-primary transition">Dashboard</Link>
                                        <img
                                            src={user.profilePicture || "https://ui-avatars.com/api/?name=" + user.username}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full bg-gray-200"
                                        />
                                        <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
                                    </div>
                                ) : (
                                    <Link to="/signup" className="px-5 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition font-semibold">
                                        Join
                                    </Link>
                                )}
                            </nav>

                            {/* Mobile Menu Button */}
                            <button
                                className="lg:hidden text-2xl text-gray-700 dark:text-gray-200 focus:outline-none"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <FaBars />
                            </button>
                        </div>
                    </div>

                    {/* Bottom Row: Categories (Desktop/Tablet) */}
                    <div className={`hidden md:flex items-center justify-between mt-4 overflow-x-auto no-scrollbar gap-6 border-t border-gray-100 dark:border-gray-800 pt-3 transition-opacity duration-300 ${isScrolled ? 'opacity-0 h-0 pointer-events-none mt-0 pt-0' : 'opacity-100'}`}>
                        {categories.map((cat, idx) => (
                            <Link
                                key={idx}
                                to={`/gigs?cat=${cat}`}
                                className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white font-medium transition-colors pb-1 border-b-2 border-transparent hover:border-primary"
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isOpen && (
                    <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg p-5 flex flex-col gap-5 lg:hidden animate-in slide-in-from-top-2">
                        {/* Mobile Search */}
                        <div className="flex w-full border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                            <input
                                type="text"
                                placeholder="Search services..."
                                className="w-full px-4 py-2.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 outline-none"
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        navigate(`/gigs?search=${input}`);
                                        setIsOpen(false);
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    navigate(`/gigs?search=${input}`);
                                    setIsOpen(false);
                                }}
                                className="bg-gray-900 dark:bg-gray-700 text-white px-5"
                            >
                                <FaSearch />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-4 font-medium text-gray-700 dark:text-gray-200">
                            <Link to="/gigs" onClick={() => setIsOpen(false)} className="hover:text-primary py-2 border-b border-gray-100 dark:border-gray-800">Explore Gigs</Link>
                            {!user && (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="hover:text-primary py-2">Sign In</Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)} className="hover:text-primary py-2">Join</Link>
                                </>
                            )}
                            {user && (
                                <>
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-primary py-2">Dashboard</Link>
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-left py-2 text-red-500">Logout</button>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </nav>

        </>
    );
};

export default Navbar;
