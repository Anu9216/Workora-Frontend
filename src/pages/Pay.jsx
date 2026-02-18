import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CheckoutForm from "../components/CheckoutForm";
import MockCheckoutForm from "../components/MockCheckoutForm";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Pay = () => {
    const [clientSecret, setClientSecret] = useState("");
    const [gig, setGig] = useState(null);
    const [error, setError] = useState(null);
    const [isDemo, setIsDemo] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const makeRequest = async () => {
            try {
                const res = await axios.post(
                    "/api/orders/create-payment-intent",
                    { gigId: id }
                );

                if (res.data.isDemo) {
                    setIsDemo(true);
                }
                setClientSecret(res.data.clientSecret);
            } catch (err) {
                console.log(err);
                setError(err.response?.data?.message || err.message || "Failed to load payment.");
            }
        };
        makeRequest();
    }, [id]);

    useEffect(() => {
        // ... gig fetch ...
        const fetchGig = async () => {
            try {
                const res = await axios.get(`/api/gigs/${id}`);
                setGig(res.data);
            } catch (err) {
                console.log(err);
                setError("Failed to load gig details.");
            }
        };
        fetchGig();
    }, [id]);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 py-10 font-sans">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                {/* Order Summary */}
                {gig && (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 h-fit">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Order Summary</h2>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-4">
                                <img
                                    src={gig.coverImage || "/img/noavatar.jpg"}
                                    alt={gig.title}
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 line-clamp-2">{gig.title}</h3>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{gig.category}</span>
                                </div>
                            </div>
                            <hr className="border-gray-200 dark:border-gray-700 my-2" />
                            <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                <span>Service Fee</span>
                                <span>₹{(gig.price * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold text-gray-800 dark:text-white mt-2">
                                <span>Total</span>
                                <span>₹{(gig.price * 1.1).toFixed(2)}</span>
                            </div>
                            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-md">
                                <p>You are paying for a secure transaction via Workora Payment Gateway.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && !isDemo && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {/* Payment Form */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                    {clientSecret ? (
                        isDemo ? (
                            <MockCheckoutForm gigId={id} amount={gig?.price} />
                        ) : (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm />
                            </Elements>
                        )
                    ) : (
                        !error && <div>Loading payment details...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pay;


