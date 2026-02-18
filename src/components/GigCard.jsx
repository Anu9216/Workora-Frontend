import React from 'react';
import { FaStar, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const GigCard = ({ gig }) => {
    return (
        <Link to={`/gig/${gig._id}`} className="group block h-full" data-aos="fade-up">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">

                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <img
                        src={gig.coverImage || "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg"}
                        alt={gig.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                    {/* Seller */}
                    <div className="flex items-center gap-3 mb-3">
                        <img
                            src={gig.seller?.profile?.profilePicture || "https://ui-avatars.com/api/?name=" + (gig.seller?.username || "Seller")}
                            alt={gig.seller?.username || "Seller"}
                            className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white hover:underline">{gig.seller?.username || "Unknown Seller"}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {gig.seller?.isVerified ? "Verified Pro" : "Freelancer"}
                            </p>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-gray-700 dark:text-gray-300 text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-grow">
                        {gig.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                        <FaStar className="text-yellow-400" />
                        <span className="font-bold text-gray-700 dark:text-gray-200">
                            {gig.rating ? gig.rating.toFixed(1) : "New"}
                        </span>
                        <span className="text-gray-400 text-sm">
                            ({gig.sales})
                        </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
                        <FaHeart className="text-gray-400 hover:text-red-500 transition cursor-pointer" />
                        <div className="text-right">
                            <span className="text-xs text-gray-400 uppercase font-semibold">Starting at</span>
                            <span className="block text-lg font-bold text-gray-900 dark:text-white">₹{gig.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default GigCard;
