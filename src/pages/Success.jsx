import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Success = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(search);
    const payment_intent = params.get("payment_intent");
    const gigId = params.get("gigId");

    useEffect(() => {
        const makeRequest = async () => {
            try {
                await axios.post("/api/orders", {
                    paymentIntentId: payment_intent,
                    gigId: gigId
                });
                setTimeout(() => {
                    navigate("/dashboard");
                }, 5000);
            } catch (err) {
                console.log(err);
            }
        };

        if (payment_intent) makeRequest();
    }, [payment_intent, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-lg border border-gray-100 dark:border-gray-700">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Payment Successful!</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Thank you for your purchase. Your order has been confirmed. You will be redirected to your orders page shortly.
                </p>
                <p className="text-sm text-gray-400">
                    Please do not close this window.
                </p>
            </div>
        </div>
    );
};

export default Success;
