import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import GigCard from '../components/GigCard';
import { FaChevronDown, FaFilter } from 'react-icons/fa';

const Gigs = () => {
    const { user } = useAuth();
    const [gigs, setGigs] = useState([]);
    const [openMenu, setOpenMenu] = useState(false);
    const [sort, setSort] = useState("sales");
    const minRef = useRef();
    const maxRef = useRef();

    const { search } = useLocation();
    // Parse existing query params to display title
    const params = new URLSearchParams(search);
    const category = params.get('cat');
    const searchQuery = params.get('search');

    const [refetchToggle, setRefetchToggle] = useState(false);

    // Unified Fetch Logic
    useEffect(() => {
        const fetchGigs = async () => {
            try {
                // Start with current URL params
                const currentParams = new URLSearchParams(search);

                // Add Sort
                if (sort) currentParams.set('sort', sort);

                // Add Min/Max if set via refs
                if (minRef.current?.value) currentParams.set('min', minRef.current.value);
                if (maxRef.current?.value) currentParams.set('max', maxRef.current.value);

                // Construct valid query string
                const queryString = currentParams.toString();
                const queryUrl = `/api/gigs?${queryString}`; // Fixed spaces

                console.log("Fetching gigs with query:", queryUrl); // Debug Log
                const res = await axios.get(queryUrl);

                // Filter out own gigs if user is logged in
                let data = res.data;
                if (user) {
                    data = data.filter(gig => gig.seller._id !== user._id);
                }

                setGigs(data);
            } catch (err) {
                console.error("Error fetching gigs:", err);
            }
        };
        fetchGigs();
    }, [search, sort, refetchToggle]);

    // "Apply" button logic for Budget
    const applyFilter = () => {
        // Force Fetch
        setSort(prev => prev === "sales" ? "sales" : prev);
        setRefetchToggle(prev => !prev);
    }

    const reSort = (type) => {
        setSort(type);
        setOpenMenu(false);
    };

    return (
        <div className="container mx-auto px-6 py-10 min-h-screen">
            <div className="flex flex-col gap-6">

                {/* Header checks */}
                <span className="text-sm text-gray-500 uppercase font-medium">Workora &gt; {category || "Gigs"}</span>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">{category || searchQuery || "All Gigs"}</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Explore the best {category || "freelance"} services to build your business.
                </p>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                    {/* Budget */}
                    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-1 rounded-md border border-gray-200 dark:border-gray-700">
                        <span className="font-medium text-gray-600 dark:text-gray-300 pl-2">Budget</span>
                        <input ref={minRef} type="number" placeholder="Min" className="border-none p-2 w-20 outline-none text-sm bg-transparent text-gray-800 dark:text-gray-200" />
                        <span className="text-gray-400">-</span>
                        <input ref={maxRef} type="number" placeholder="Max" className="border-none p-2 w-20 outline-none text-sm bg-transparent text-gray-800 dark:text-gray-200" />
                        <button onClick={applyFilter} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition font-medium text-sm">Apply</button>
                    </div>
                    {(minRef.current?.value || maxRef.current?.value || sort !== "sales") && (
                        <button onClick={() => {
                            minRef.current.value = "";
                            maxRef.current.value = "";
                            setSort("sales");
                            setRefetchToggle(!refetchToggle);
                        }} className="text-sm text-gray-500 hover:text-red-500 transition underline">
                            Clear Filters
                        </button>
                    )}

                    {/* Sort */}
                    <div className="relative">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setOpenMenu(!openMenu)}>
                            <span className="text-gray-500 dark:text-gray-400">Sort:</span>
                            <span className="font-semibold text-gray-800 dark:text-white capitalize">
                                {sort === "sales" ? "Best Selling" : "Newest"}
                            </span>
                            <FaChevronDown className="text-gray-500 text-sm" />
                        </div>
                        {openMenu && (
                            <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-20 flex flex-col w-40 overflow-hidden">
                                {sort === "sales" ? (
                                    <span onClick={() => reSort("createdAt")} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-200">Newest</span>
                                ) : (
                                    <span onClick={() => reSort("sales")} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-200">Best Selling</span>
                                )}
                                <span onClick={() => reSort("lowest")} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-200 md:hidden">Lowest Price</span>
                                <span onClick={() => reSort("highest")} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-200 md:hidden">Highest Price</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 my-8">
                    {gigs.map(gig => (
                        <GigCard key={gig._id} gig={gig} />
                    ))}
                </div>

                {gigs.length === 0 && (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                        <FaFilter className="text-4xl mx-auto mb-4 opacity-50" />
                        <h2 className="text-xl font-semibold">No gigs found</h2>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gigs;
