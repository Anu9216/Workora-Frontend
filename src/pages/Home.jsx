import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaSearch, FaCheckCircle, FaStar } from 'react-icons/fa';
import GigCard from '../components/GigCard';

// Mock Data Preserved
const Home = () => {
    const [gigs, setGigs] = useState([]);
    const { user } = useAuth();
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                const res = await axios.get("/api/gigs");
                if (Array.isArray(res.data)) {
                    let data = res.data;
                    if (user) {
                        data = data.filter(gig => gig.seller._id !== user._id);
                    }
                    setGigs(data);
                } else {
                    console.error("Unexpected API response format:", res.data);
                    setGigs([]);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchGigs();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-100 transition-colors">

            {/* 1. Hero Section */}
            <div className="relative bg-emerald-900 text-white overflow-hidden min-h-[600px] flex items-center">
                {/* Background Image - HD Freelance/Creative Workspace */}
                <div className="absolute inset-0 z-0">
                    <img src="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1600" className="w-full h-full object-cover opacity-50" alt="Creative Freelance Workspace" />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-8" data-aos="fade-up">
                            Find the perfect <span className="text-primary italic font-serif">freelance</span> services for your business.
                        </h1>

                        <div className="bg-white rounded-md p-1 flex items-center max-w-lg mb-8 shadow-2xl transform transition-transform focus-within:scale-105 duration-300" data-aos="fade-up" data-aos-delay="100">
                            <FaSearch className="text-gray-400 ml-3 text-lg" />
                            <input
                                type="text"
                                placeholder='Try "building mobile app"'
                                className="w-full px-4 py-3 text-gray-700 outline-none text-lg"
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && navigate(`/gigs?search=${input}`)}
                            />
                            <button
                                onClick={() => navigate(`/gigs?search=${input}`)}
                                className="bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-md transition duration-300"
                            >
                                Search
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-200" data-aos="fade-up" data-aos-delay="200">
                            <span>Popular:</span>
                            <span onClick={() => navigate('/gigs?cat=Graphics & Design')} className="border border-white/30 rounded-full px-3 py-0.5 hover:bg-white/20 cursor-pointer transition">Website Design</span>
                            <span onClick={() => navigate('/gigs?cat=Programming & Tech')} className="border border-white/30 rounded-full px-3 py-0.5 hover:bg-white/20 cursor-pointer transition">WordPress</span>
                            <span onClick={() => navigate('/gigs?cat=Graphics & Design')} className="border border-white/30 rounded-full px-3 py-0.5 hover:bg-white/20 cursor-pointer transition">Logo Design</span>
                            <span onClick={() => navigate('/gigs?cat=AI Services')} className="border border-white/30 rounded-full px-3 py-0.5 hover:bg-white/20 cursor-pointer transition">AI Services</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Trusted By (Marquee Animation) */}
            <div className="bg-gray-50 dark:bg-gray-800 py-10 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex w-max animate-scroll gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 items-center">
                    {/* Doubled list for seamless loop */}
                    {["META", "GOOGLE", "NETFLIX", "P&G", "PAYPAL", "APPLE", "MICROSOFT", "AMAZON", "META", "GOOGLE", "NETFLIX", "P&G", "PAYPAL", "APPLE", "MICROSOFT", "AMAZON"].map((logo, idx) => (
                        <span key={idx} className="text-2xl font-bold text-gray-400 dark:text-gray-500 mx-8">{logo}</span>
                    ))}
                </div>
            </div>

            {/* 3. Popular Services */}
            <div className="container mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Popular Professional Services</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[
                        { title: "AI Artists", color: "bg-orange-500", img: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400", cat: "AI Services" },
                        { title: "Logo Design", color: "bg-green-500", img: "https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400", cat: "Graphics & Design" },
                        { title: "WordPress", color: "bg-blue-500", img: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400", cat: "Programming & Tech" },
                        { title: "Voice Over", color: "bg-purple-500", img: "https://images.pexels.com/photos/6686455/pexels-photo-6686455.jpeg?auto=compress&cs=tinysrgb&w=400", cat: "Music & Audio" },
                        { title: "Video Explainer", color: "bg-red-500", img: "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=400", cat: "Video & Animation" },
                    ].map((service, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(`/gigs?cat=${service.cat}`)}
                            className="relative group rounded-md overflow-hidden cursor-pointer h-64 shadow-md"
                            data-aos="zoom-in"
                            data-aos-delay={idx * 100}
                        >
                            <img src={service.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={service.title} />
                            <div className={`absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors`}></div>
                            <div className="absolute top-4 left-4">
                                <p className="text-gray-200 text-sm font-medium">Build your brand</p>
                                <h3 className="text-white text-2xl font-bold">{service.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Value Proposition */}
            <div className="bg-emerald-50 dark:bg-emerald-900/10 py-20">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-gray-900 dark:text-white" data-aos="fade-right">A whole world of freelance talent at your fingertips</h2>

                        <div className="space-y-6" data-aos="fade-right" data-aos-delay="100">
                            {[
                                { title: "The best for every budget", desc: "Find high-quality services at every price point. No hourly rates, just project-based pricing." },
                                { title: "Quality work done quickly", desc: "Find the right freelancer to begin working on your project within minutes." },
                                { title: "Protected payments, every time", desc: "Always know what you'll pay upfront. Your payment isn't released until you approve the work." },
                                { title: "24/7 support", desc: "Questions? Our round-the-clock support team is available to help anytime, anywhere." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-3">
                                    <FaCheckCircle className="text-gray-600 dark:text-gray-400 text-xl mt-1 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">{item.title}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl" data-aos="fade-left">
                        <img src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="absolute inset-0 w-full h-full object-cover" alt="Team" />
                    </div>
                </div>
            </div>

            {/* 5. Gigs Marketplace */}
            <div className="container mx-auto px-6 py-20">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gigs you may like</h2>
                    <button
                        onClick={() => navigate('/gigs')}
                        className="text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                    >
                        Explore All Gigs &rarr;
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {gigs.map(gig => (
                        <GigCard key={gig._id} gig={gig} />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Home;
