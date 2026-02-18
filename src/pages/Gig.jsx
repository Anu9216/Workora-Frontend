import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaCheck, FaClock, FaRedo, FaHeart, FaChevronLeft, FaChevronRight, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import GigCard from '../components/GigCard';

const Gig = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [gig, setGig] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [reviewDesc, setReviewDesc] = useState("");
    const [reviewStar, setReviewStar] = useState(5);
    const [recommendedGigs, setRecommendedGigs] = useState([]);

    useEffect(() => {
        const fetchGigData = async () => {
            try {
                // Fetch Gig Details
                const gigRes = await axios.get(`/api/gigs/${id}`);
                setGig(gigRes.data);

                // Fetch Reviews
                try {
                    const reviewRes = await axios.get(`/api/reviews/${id}`);
                    setReviews(reviewRes.data);
                } catch (reviewErr) {
                    console.error("Error fetching reviews:", reviewErr);
                    // Don't fail the whole page if reviews fail
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGigData();
    }, [id]);

    useEffect(() => {
        if (gig) {
            const fetchRecommended = async () => {
                try {
                    const res = await axios.get(`/api/gigs?cat=${gig.category}`);
                    setRecommendedGigs(res.data.filter(g => g._id !== gig._id).slice(0, 4));
                } catch (err) {
                    console.error("Failed to fetch recommended gigs", err);
                }
            };
            fetchRecommended();
        }
    }, [gig]);

    const nextImage = () => {
        if (gig && gig.images && gig.images.length > 0) {
            setCurrentImageIndex((prev) => (prev === gig.images.length - 1 ? 0 : prev + 1));
        }
    };

    const prevImage = () => {
        if (gig && gig.images && gig.images.length > 0) {
            setCurrentImageIndex((prev) => (prev === 0 ? gig.images.length - 1 : prev - 1));
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center dark:text-white">Loading...</div>;
    if (!gig) return <div className="min-h-screen flex items-center justify-center dark:text-white">Gig not found</div>;

    // Combine cover image and additional images for slider if needed, or just use images array
    // Assuming gig.images includes all images or we want to include coverImage too.
    // Let's use coverImage as the first image if it's not in the images array, or just trust the images array if populated.
    // For robust display:
    const displayImages = gig.images && gig.images.length > 0 ? gig.images : [gig.coverImage];


    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-10 font-sans text-gray-800 dark:text-gray-100">
            <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* LEFT COLUMN: Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Breadcrumbs */}
                    <div className="text-sm text-gray-500 uppercase font-medium tracking-wide">
                        <Link to="/" className="hover:underline">Workora</Link> {'>'} <Link to={`/gigs?cat=${gig.category}`} className="hover:underline capitalize">{gig.category}</Link>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold leading-snug">{gig.title}</h1>

                    {/* User Mini Profile */}
                    <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                        <img src={gig.seller.profile?.profilePicture || "https://ui-avatars.com/api/?name=" + gig.seller.username} alt="" className="w-14 h-14 rounded-full object-cover border border-gray-200" />
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-0.5 text-lg">{gig.seller.username}</h3>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < Math.round(gig.rating) ? "" : "text-gray-300 dark:text-gray-600"} />
                                    ))}
                                </div>
                                <span className="text-yellow-500 font-bold">{gig.rating ? gig.rating.toFixed(1) : "New"}</span>
                                <span className="text-gray-400">({reviews.length} reviews)</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Slider */}
                    <div className="relative group rounded-lg overflow-hidden h-[400px] lg:h-[500px] shadow-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <img
                            src={displayImages[currentImageIndex]}
                            alt="Gig Preview"
                            className="w-full h-full object-cover transition-transform duration-500"
                        />
                        {displayImages.length > 1 && (
                            <>
                                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition opacity-0 group-hover:opacity-100">
                                    <FaChevronLeft size={20} />
                                </button>
                                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition opacity-0 group-hover:opacity-100">
                                    <FaChevronRight size={20} />
                                </button>
                            </>
                        )}
                        {/* Thumbnails */}
                        {displayImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {displayImages.map((_, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-2 h-2 rounded-full cursor-pointer transition-all ${currentImageIndex === idx ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* About This Gig */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">About This Gig</h2>
                        <div className="leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-line">
                            {gig.description}
                        </div>
                    </div>

                    {/* About The Seller */}
                    <div className="space-y-6 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">About The Seller</h2>
                        <div className="flex gap-6 items-start">
                            <img src={gig.seller.profile?.profilePicture || "https://ui-avatars.com/api/?name=" + gig.seller.username} alt="" className="w-20 h-20 rounded-full object-cover" />
                            <div className="space-y-2">
                                <h3 className="font-bold text-lg">{gig.seller.username}</h3>
                                <p className="text-gray-500">{gig.seller.profile?.shortDesc || "Professional Freelancer"}</p>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <div className="flex text-sm"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                                    <span className="text-gray-500 font-medium text-sm">({reviews.length} reviews)</span>
                                </div>
                                <button onClick={() => {
                                    if (!user) {
                                        navigate("/login", { state: { from: location } });
                                        return;
                                    }
                                    const cleanId = gig.seller._id.toString().replace(/[^0-9a-fA-F]/g, '');
                                    navigate(`/user/${cleanId}`);
                                }}
                                    disabled={user?._id === gig.seller._id}
                                    className={`border border-gray-300 dark:border-gray-600 px-6 py-2 rounded-md transition font-medium text-sm ${user?._id === gig.seller._id ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                                    {user?._id === gig.seller._id ? "Your Gig" : "Contact Me"}
                                </button>
                            </div>
                        </div>

                        {/* Seller Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border p-6 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                            <div>
                                <span className="block text-gray-500 text-sm">From</span>
                                <span className="font-bold">{gig.seller.country || "Global"}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-sm">Member since</span>
                                <span className="font-bold">{new Date(gig.seller.createdAt).getFullYear()}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-sm">Avg. response time</span>
                                <span className="font-bold">1 Hour</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-sm">Languages</span>
                                <span className="font-bold">English</span>
                            </div>
                            {/* Bio */}
                            <div className="col-span-1 sm:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    {gig.seller.profile?.bio || "I am a professional freelancer ready to help you with your project."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="space-y-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reviews</h2>
                            <div className="flex items-center gap-2 text-yellow-500 font-bold text-lg">
                                <FaStar />
                                <span>{gig.rating ? gig.rating.toFixed(1) : "N/A"}</span>
                                <span className="text-gray-400 font-normal text-base">({reviews.length})</span>
                            </div>
                        </div>

                        {/* Add Review Form */}
                        {user && user.role !== 'freelancer' && (
                            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h3 className="font-bold mb-4">Add a Review</h3>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        const res = await axios.post("/api/reviews", {
                                            gigId: gig._id,
                                            desc: reviewDesc,
                                            star: reviewStar
                                        });
                                        setReviews([...reviews, res.data]);
                                        setReviewDesc("");
                                        toast.success("Review posted successfully!");
                                    } catch (err) {
                                        console.log(err);
                                        toast.error(err.response?.data?.message || "Something went wrong!");
                                    }
                                }} className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Rating:</span>
                                        <select
                                            value={reviewStar}
                                            onChange={(e) => setReviewStar(parseInt(e.target.value))}
                                            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                        >
                                            <option value={1}>1 Star</option>
                                            <option value={2}>2 Stars</option>
                                            <option value={3}>3 Stars</option>
                                            <option value={4}>4 Stars</option>
                                            <option value={5}>5 Stars</option>
                                        </select>
                                    </div>
                                    <textarea
                                        placeholder="Write your opinion..."
                                        value={reviewDesc}
                                        onChange={(e) => setReviewDesc(e.target.value)}
                                        className="p-4 border rounded-md min-h-[100px] dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-primary/50"
                                        required
                                    />
                                    <button className="self-end bg-primary text-white font-bold py-2 px-6 rounded-md hover:bg-emerald-600 transition">Send</button>
                                </form>
                            </div>
                        )}

                        {reviews.length === 0 ? (
                            <div className="py-8 text-gray-500 italic">No reviews yet. Be the first to review!</div>
                        ) : (
                            <div className="space-y-8">
                                {reviews.map((review) => (
                                    <div key={review._id} className="border-t border-gray-100 dark:border-gray-800 pt-6 first:border-0 first:pt-0">
                                        <div className="flex items-start gap-4">
                                            {/* Reviewer Image (Using mock or if we populate user in review) - assuming review doesn't have populated user for now, using initial */}
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                                                {/* In a real app we'd populate review.userId to get username/img */}
                                                U
                                            </div>
                                            <div className="space-y-2 w-full">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">User Review</h4>
                                                        <div className="flex items-center gap-2 text-sm text-yellow-500 mt-1">
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <FaStar key={i} className={i < review.star ? "" : "text-gray-300 dark:text-gray-600"} />
                                                                ))}
                                                            </div>
                                                            <span className="font-medium">{review.star}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-400">1 week ago</span>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                                    {review.desc}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium pt-2">
                                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                                                        <FaThumbsUp /> <span>Helpful</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                                                        <FaThumbsDown /> <span>Not Helpful</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* RIGHT COLUMN: Sticky Sidebar Pricing */}
                <div className="relative hidden lg:block">
                    <div className="sticky top-28 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wide">Standard</h3>
                            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">₹{gig.price}</span>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-800 dark:text-gray-100">{gig.shortTitle}</h4>
                                <p className="text-gray-600 dark:text-gray-300 font-medium text-sm leading-relaxed">
                                    {gig.shortDesc}
                                </p>
                            </div>

                            <div className="flex justify-between items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <div className="flex items-center gap-2">
                                    <FaClock className="text-gray-400" />
                                    <span>{gig.deliveryTime} Days Delivery</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaRedo className="text-gray-400" />
                                    <span>{gig.revisionNumber} Revisions</span>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                {gig.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                        <FaCheck className="text-green-500 mt-0.5 shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            navigate("/login", { state: { from: location } });
                                            return;
                                        }
                                        window.location.href = `/pay/${gig._id}`;
                                    }}
                                    disabled={user?._id === gig.seller._id}
                                    className={`w-full font-bold py-3 rounded-md transition duration-300 shadow-md flex items-center justify-center gap-2 ${user?._id === gig.seller._id ? "bg-gray-400 cursor-not-allowed text-white" : "bg-primary hover:bg-emerald-600 text-white"}`}>
                                    <span>{user?._id === gig.seller._id ? "You cannot buy your own gig" : "Continue"}</span>
                                    {user?._id !== gig.seller._id && <span>(₹{gig.price})</span>}
                                </button>

                                <button
                                    onClick={() => {
                                        if (!user) {
                                            navigate("/login", { state: { from: location } });
                                            return;
                                        }
                                        const cleanId = gig.seller._id.toString().replace(/[^0-9a-fA-F]/g, '');
                                        navigate(`/user/${cleanId}`);
                                    }}
                                    disabled={user?._id === gig.seller._id}
                                    className={`w-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold py-2 rounded-md transition ${user?._id === gig.seller._id ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
                                    {user?._id === gig.seller._id ? "Your Gig" : "Contact Seller"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Recommended Gigs */}
            {recommendedGigs.length > 0 && (
                <div className="container mx-auto px-4 lg:px-8 py-16 border-t border-gray-200 dark:border-gray-800 mt-10">
                    <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Recommended For You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recommendedGigs.map(g => (
                            <GigCard key={g._id} gig={g} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gig;
