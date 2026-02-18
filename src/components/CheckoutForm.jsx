import React, { useEffect, useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: "http://localhost:5173/success",
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs"
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Complete your Payment</h2>

            <PaymentElement id="payment-element" options={paymentElementOptions} />

            <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full bg-primary text-white font-bold text-lg p-4 rounded-md mt-6 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">Processing...</div> : "Pay now"}
                </span>
            </button>

            {/* Show any error or success messages */}
            {message && <div id="payment-message" className="mt-4 text-center text-red-500 font-medium bg-red-50 dark:bg-red-900/10 p-2 rounded-md">{message}</div>}
        </form>
    );
}

export default CheckoutForm;
