import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MockCheckoutForm = ({ gigId, amount }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' or 'upi'
    const [mockCard, setMockCard] = useState({
        name: "Demo User",
        number: "4242 4242 4242 4242",
        expiry: "12/30",
        cvc: "123"
    });
    const [mockUpi, setMockUpi] = useState("demo@upi");

    const handleCardChange = (e) => {
        setMockCard({ ...mockCard, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate network delay
        setTimeout(() => {
            setLoading(false);
            const method = paymentMethod === 'card' ? 'card' : 'upi';
            const demoPaymentId = `demo_${method}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            // Redirect to success page with demo ID and gig ID
            navigate(`/success?payment_intent=${demoPaymentId}&gigId=${gigId}`);
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-200 mb-1">Demo Mode Active</h3>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Stripe keys are missing or invalid. This is a simulation. No real money will be charged.
                </p>
            </div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Complete Demo Payment</h2>

            {/* Payment Method Tabs */}
            <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
                <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 pb-2 text-center font-medium transition-colors ${paymentMethod === "card"
                            ? "border-b-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 dark:border-yellow-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                >
                    Card
                </button>
                <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`flex-1 pb-2 text-center font-medium transition-colors ${paymentMethod === "upi"
                            ? "border-b-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 dark:border-yellow-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                >
                    UPI
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {paymentMethod === "card" ? (
                    <>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Cardholder Name</label>
                            <input
                                type="text"
                                name="name"
                                value={mockCard.name}
                                onChange={handleCardChange}
                                className="p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Card Number</label>
                            <input
                                type="text"
                                name="number"
                                value={mockCard.number}
                                onChange={handleCardChange}
                                className="p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-mono"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiry</label>
                                <input
                                    type="text"
                                    name="expiry"
                                    value={mockCard.expiry}
                                    onChange={handleCardChange}
                                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">CVC</label>
                                <input
                                    type="text"
                                    name="cvc"
                                    value={mockCard.cvc}
                                    onChange={handleCardChange}
                                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">UPI ID</label>
                        <input
                            type="text"
                            value={mockUpi}
                            onChange={(e) => setMockUpi(e.target.value)}
                            placeholder="username@upi"
                            className="p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        />
                        <p className="text-xs text-gray-500">Enter your VPA (Virtual Payment Address)</p>
                    </div>
                )}
            </div>

            <button disabled={loading} type="submit" className="w-full bg-primary text-white font-bold text-lg p-4 rounded-md mt-6 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg">
                {loading ? "Processing Demo..." : `Pay ₹${amount ? (amount * 1.1).toFixed(2) : "0.00"}`}
            </button>
        </form>
    );
};

export default MockCheckoutForm;
