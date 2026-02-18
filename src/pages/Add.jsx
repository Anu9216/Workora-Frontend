import React, { useState } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Add = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        category: 'Graphics & Design',
        cover: '', // Note: This remains empty string in state, but we handle file separately
        desc: '',
        shortTitle: '',
        shortDesc: '',
        deliveryTime: 1,
        revisionNumber: 1,
        price: 0,
        features: []
    });

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [featureInput, setFeatureInput] = useState("");
    const [isUnlimitedRevisions, setIsUnlimitedRevisions] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const addFeature = (e) => {
        e.preventDefault();
        if (featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, featureInput]
            }));
            setFeatureInput("");
        }
    };

    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const handleUnlimitedRevisionsChange = (e) => {
        setIsUnlimitedRevisions(e.target.checked);
        if (e.target.checked) {
            setFormData(prev => ({ ...prev, revisionNumber: 1000 })); // Using 1000 to represent unlimited/high
        } else {
            setFormData(prev => ({ ...prev, revisionNumber: 1 }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset Error
        setError(null);

        // Validation
        if (!file) {
            setError("Please upload a cover image.");
            return;
        }

        // Validate specific fields but ignore 'cover' since it's in 'file' state
        // and 'features' since it's an array
        for (const key in formData) {
            if (key !== 'features' && key !== 'cover' && formData[key] === '') {
                setError(`Please fill in the ${key} field.`);
                return;
            }
        }

        if (formData.features.length === 0) {
            setError("Please add at least one feature.");
            return;
        }

        if (formData.title.length < 10) {
            setError("Title must be at least 10 characters long.");
            return;
        }

        if (formData.desc.length < 20) {
            setError("Description must be at least 20 characters long.");
            return;
        }

        setUploading(true);

        const data = new FormData();
        data.append("image", file);
        Object.keys(formData).forEach(key => {
            if (key === 'features') {
                formData.features.forEach(feature => {
                    data.append("features", feature);
                });
            } else {
                data.append(key, formData[key]);
            }
        });

        // Get token from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        if (!token) {
            setError("You must be logged in to create a gig.");
            return;
        }

        try {
            await axios.post("/api/gigs", data, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            navigate('/gigs');
        } catch (err) {
            console.log(err);
            // DEBUG: Show full error details
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong! Please try again.";
            setError(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-24 font-sans text-gray-800 dark:text-gray-200">
            <div className="container mx-auto px-6 lg:px-20">
                <h1 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">Create a New Gig</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT COLUMN: Basic Info */}
                    <div className="space-y-8">

                        {/* Title */}
                        <div>
                            <label className="block text-lg font-semibold mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. I will do something I'm really good at"
                                className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-lg font-semibold mb-2">Category</label>
                            <select
                                name="category"
                                className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition"
                                onChange={handleChange}
                            >
                                <option>Graphics & Design</option>
                                <option>Web Development</option>
                                <option>Animation</option>
                                <option>Music & Audio</option>
                            </select>
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-lg font-semibold mb-2">Cover Image</label>
                            <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-10 flex flex-col items-center justify-center bg-white dark:bg-gray-800 text-gray-500 hover:border-primary transition cursor-pointer group">
                                <FaCloudUploadAlt className="text-4xl mb-3 group-hover:text-primary transition" />
                                <span className="font-medium">{file ? file.name : "Click to upload"}</span>
                                <input type="file" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-lg font-semibold mb-2">Description</label>
                            <textarea
                                name="desc"
                                placeholder="Brief descriptions to introduce your service to customers"
                                cols="30"
                                rows="10"
                                className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Service Details */}
                    <div className="space-y-8">
                        <div>
                            <label className="block text-lg font-semibold mb-2">Service Title</label>
                            <input
                                type="text"
                                name="shortTitle"
                                placeholder="e.g. One-page web design"
                                className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-semibold mb-2">Short Description</label>
                            <textarea
                                name="shortDesc"
                                placeholder="Short description of your service"
                                cols="30"
                                rows="4"
                                className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-lg font-semibold mb-2">Delivery Time (e.g. 3 days)</label>
                            <input
                                type="number"
                                name="deliveryTime"
                                min="1"
                                value={formData.deliveryTime}
                                onWheel={(e) => e.target.blur()}
                                className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-semibold mb-2">Revision Number</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    name="revisionNumber"
                                    min="1"
                                    disabled={isUnlimitedRevisions}
                                    value={isUnlimitedRevisions ? "" : formData.revisionNumber}
                                    onWheel={(e) => e.target.blur()}
                                    className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition disabled:bg-gray-100 disabled:text-gray-400"
                                    onChange={handleChange}
                                />
                                <label className="flex items-center gap-2 whitespace-nowrap cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                                        checked={isUnlimitedRevisions}
                                        onChange={handleUnlimitedRevisionsChange}
                                    />
                                    <span>Unlimited</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg font-semibold mb-2">Add Features</label>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="e.g. page design"
                                    className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    // Prevent form submission on Enter in this field, instead add feature
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(e); } }}
                                />
                                <button type="button" onClick={addFeature} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.features.map((f, i) => (
                                    <span key={i} className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {f}
                                        <button type="button" onClick={() => removeFeature(i)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg font-semibold mb-2">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                min="1"
                                value={formData.price}
                                onWheel={(e) => e.target.blur()}
                                className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition"
                                onChange={handleChange}
                            />
                        </div>

                        <button disabled={uploading} type="submit" className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-4 rounded-md text-lg transition duration-300 shadow-lg mt-8 disabled:bg-gray-400">
                            {uploading ? "Creating..." : "Create Gig"}
                        </button>
                        {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-200">{error}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Add;
