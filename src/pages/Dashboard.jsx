import React, { useState } from 'react';
import { FaBox, FaClipboardList, FaPlus, FaUser, FaBars, FaTimes, FaShoppingBag, FaStar, FaEnvelope, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useContext, useEffect } from 'react';

// Mock Data
const MOCK_PURCHASES = [
    { id: 1, service: "Logo Design for Startup", seller: "designpro", date: "2023-10-25", amount: 50, status: "Completed" },
    { id: 2, service: "SEO Optimization", seller: "rankmaster", date: "2023-11-02", amount: 120, status: "In Progress" },
    { id: 3, service: "Voice Over", seller: "voice_guy", date: "2023-11-10", amount: 30, status: "In Progress" },
];

const MOCK_GIGS = [
    { id: 1, title: "I will design a visionary modern logo", price: 50, orders: 12, rating: 4.9, img: "https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 2, title: "I will build a React app", price: 150, orders: 5, rating: 5.0, img: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400" },
];

const MOCK_ORDERS = [
    { id: 101, buyer: "startup_founder", gig: "I will design a visionary modern logo", due: "2023-11-15", amount: 50, status: "Pending" },
    { id: 102, buyer: "marketing_agency", gig: "I will build a React app", due: "2023-11-20", amount: 150, status: "In Progress" },
];

const Dashboard = () => {
    const [isSellerMode, setIsSellerMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('purchases');

    // Data States
    const [orders, setOrders] = useState([]);
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Initialize View based on Role
    useEffect(() => {
        if (user) {
            if (user.isSeller || user.role === 'freelancer') {
                setIsSellerMode(true);
                setActiveTab('gigs');
            } else {
                setIsSellerMode(false);
                setActiveTab('purchases');
            }
        }
    }, [user?.role, user?.isSeller]); // Run when user role loads/changes

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Sync active tab when switching modes
    const switchMode = (mode) => {
        setIsSellerMode(mode === 'seller');
        setActiveTab(mode === 'seller' ? 'gigs' : 'purchases');
        setSidebarOpen(false); // Close sidebar on mobile after switch
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Orders
                const ordersRes = await axios.get("/api/orders", { withCredentials: true });
                setOrders(ordersRes.data);

                // Fetch My Gigs if seller
                if (user?.isSeller || user?.role === 'freelancer') {
                    const gigsRes = await axios.get(`/api/gigs?userId=${user._id}`, { withCredentials: true });
                    setGigs(gigsRes.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user, activeTab]);

    // Update Status Logic
    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await axios.patch(`/api/orders/${id}`, { status }, { withCredentials: true });

            // Optimistically update UI
            setOrders(prev => prev.map(order => order._id === id ? res.data : order));
        } catch (err) {
            console.error("Failed to update status", err);
        }
    }

    const handleDeleteGig = async (id) => {
        if (window.confirm("Are you sure you want to delete this gig? This action cannot be undone.")) {
            try {
                await axios.delete(`/api/gigs/${id}`, { withCredentials: true });
                setGigs(prev => prev.filter(gig => gig._id !== id));
            } catch (err) {
                console.error("Failed to delete gig", err);
            }
        }
    };

    const handleContact = async (userId) => {
        const sellerId = userId;
        const buyerId = user._id;

        if (sellerId === buyerId) return; // Cannot message self

        try {
            const res = await axios.get(`/api/conversations/single/${sellerId}`, { withCredentials: true });
            navigate(`/message/${res.data.id}`);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                // Create new conversation
                try {
                    const res = await axios.post(`/api/conversations`, { to: sellerId }, { withCredentials: true });
                    navigate(`/message/${res.data.id}`);
                } catch (createErr) {
                    console.error("Failed to create conversation", createErr);
                }
            } else {
                console.error("Failed to get conversation", err);
            }
        }
    };

    // Filter Logic
    // Filter Logic
    const purchases = orders.filter(order => {
        const buyerId = order.buyer?._id || order.buyer?.id || order.buyer;
        const currentId = user?._id || user?.id;
        return (buyerId?.toString() === currentId?.toString());
    });

    const activeOrders = orders.filter(order => {
        const sellerId = order.seller?._id || order.seller?.id || order.seller;
        const currentId = user?._id || user?.id;
        return (sellerId?.toString() === currentId?.toString());
    });

    console.log("Dashboard Debug:", { total: orders.length, purchases: purchases.length, active: activeOrders.length });



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex font-sans" data-aos="fade-in">

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar}></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {isSellerMode ? "Freelancer" : "Client"} <span className="text-primary">.</span>
                    </h2>
                    <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-800 dark:hover:text-white">
                        <FaTimes />
                    </button>
                </div>

                <div className="p-4 space-y-2">
                    {/* Mode Switcher - Only for Sellers */}
                    {user?.isSeller && (
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
                            <button
                                onClick={() => switchMode('buyer')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isSellerMode ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                            >
                                Buying
                            </button>
                            <button
                                onClick={() => switchMode('seller')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isSellerMode ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                            >
                                Selling
                            </button>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <nav className="space-y-1">
                        {!isSellerMode ? (
                            <>
                                <button
                                    onClick={() => { setActiveTab('purchases'); setSidebarOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-md transition-colors ${activeTab === 'purchases' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                >
                                    <FaShoppingBag /> My Purchases
                                </button>
                                <button
                                    onClick={() => { navigate('/profile'); setSidebarOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                                >
                                    <FaUser /> Profile Settings
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => { setActiveTab('gigs'); setSidebarOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-md transition-colors ${activeTab === 'gigs' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                >
                                    <FaBox /> My Gigs
                                </button>
                                <button
                                    onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-md transition-colors ${activeTab === 'orders' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                >
                                    <FaClipboardList /> Active Orders
                                </button>
                                <button
                                    onClick={() => { navigate('/profile'); setSidebarOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                                >
                                    <FaUser /> Profile Settings
                                </button>
                            </>
                        )}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-10 overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                        {isSellerMode ? "Freelancer Dashboard" : "Client Dashboard"}
                    </h1>
                    <button onClick={toggleSidebar} className="p-2 border border-gray-300 rounded-md text-gray-600 dark:text-gray-300">
                        <FaBars />
                    </button>
                </div>

                <div data-aos="fade-up" data-aos-delay="100">
                    {/* Buyer View: Purchases */}
                    {!isSellerMode && activeTab === 'purchases' && (
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Purchases</h1>
                            {purchases.length === 0 ? (
                                <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400">No active purchases found.</p>
                                    <Link to="/gigs" className="text-primary hover:underline mt-2 inline-block">Browse Gigs</Link>
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                                                <th className="p-4 font-semibold">Service</th>
                                                <th className="p-4 font-semibold">Seller</th>
                                                <th className="p-4 font-semibold">Date</th>
                                                <th className="p-4 font-semibold">Amount</th>
                                                <th className="p-4 font-semibold">Status</th>
                                                <th className="p-4 font-semibold text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {purchases.map((order) => (
                                                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <td className="p-4 text-gray-800 dark:text-gray-200 font-medium whitespace-nowrap">{order.gig?.title}</td>
                                                    <td className="p-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">@{order.seller?.username}</td>
                                                    <td className="p-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-4 text-gray-800 dark:text-gray-200 font-bold whitespace-nowrap">₹{order.price}</td>
                                                    <td className="p-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                                {order.status}
                                                            </span>
                                                            <button onClick={() => handleContact(order.seller?._id)} className="text-gray-400 hover:text-primary transition p-1" title="Message Seller"><FaEnvelope /></button>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        {order.status === 'delivered' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(order._id, 'completed')}
                                                                className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 transition"
                                                            >
                                                                Mark Complete
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Seller View: Gigs */}
                    {isSellerMode && activeTab === 'gigs' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Gigs</h1>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage and track your active gigs</p>
                                </div>
                                <Link
                                    to="/add"
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <FaPlus className="text-sm" /> Create New Gig
                                </Link>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                                {gigs.length === 0 ? (
                                    <div className="p-10 text-center flex flex-col items-center justify-center text-gray-500">
                                        <FaBox className="text-4xl mb-3 text-gray-300 dark:text-gray-600" />
                                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No Gigs Found</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Start selling your services today!</p>
                                        <Link
                                            to="/add"
                                            className="text-emerald-600 font-medium hover:underline"
                                        >
                                            Create your first Gig
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50/50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                                                    <th className="px-6 py-4">Gig Details</th>
                                                    <th className="px-6 py-4">Price</th>
                                                    <th className="px-6 py-4 text-center">Sales</th>
                                                    <th className="px-6 py-4 text-center">Rating</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {gigs.map((gig) => (
                                                    <tr key={gig._id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                                                                    <img
                                                                        src={gig.coverImage}
                                                                        alt={gig.title}
                                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                                    />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-xs sm:max-w-md group-hover:text-emerald-600 transition-colors">
                                                                        {gig.title}
                                                                    </h3>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                                                                        {gig.category}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="text-gray-900 dark:text-white font-bold">₹{gig.price}</span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600 dark:text-gray-300">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                                {gig.sales} Sales
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <div className="flex items-center justify-center gap-1.5 ">
                                                                <FaStar className="text-yellow-400" />
                                                                <span className="font-semibold text-gray-700 dark:text-gray-200">
                                                                    {!isNaN(gig.totalStars / gig.starNumber)
                                                                        ? (gig.totalStars / gig.starNumber).toFixed(1)
                                                                        : "N/A"
                                                                    }
                                                                </span>
                                                                <span className="text-xs text-gray-400">({gig.starNumber})</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button className="text-gray-400 hover:text-emerald-600 transition-colors mr-4" title="Edit">
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteGig(gig._id)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                                title="Delete"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Seller View: Orders */}
                    {isSellerMode && activeTab === 'orders' && (
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Active Orders</h1>
                            {activeOrders.length === 0 ? (
                                <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400">No active orders found.</p>
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                                                <th className="p-4 font-semibold">Buyer</th>
                                                <th className="p-4 font-semibold">Gig</th>
                                                <th className="p-4 font-semibold">Date</th>
                                                <th className="p-4 font-semibold">Total</th>
                                                <th className="p-4 font-semibold">Status</th>
                                                <th className="p-4 font-semibold text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {activeOrders.map((order) => (
                                                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <td className="p-4 text-gray-800 dark:text-gray-200 font-medium whitespace-nowrap">@{order.buyer?.username}</td>
                                                    <td className="p-4 text-gray-600 dark:text-gray-300 line-clamp-1 max-w-xs">{order.gig?.title}</td>
                                                    <td className="p-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-4 text-gray-800 dark:text-gray-200 font-bold whitespace-nowrap">₹{order.price}</td>
                                                    <td className="p-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                                                {order.status}
                                                            </span>
                                                            <button onClick={() => handleContact(order.buyer?._id)} className="text-gray-400 hover:text-primary transition p-1" title="Message Buyer"><FaEnvelope /></button>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        {order.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(order._id, 'in_progress')}
                                                                className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 transition"
                                                            >
                                                                Accept Order
                                                            </button>
                                                        )}
                                                        {order.status === 'in_progress' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                                                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
                                                            >
                                                                Deliver Work
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
