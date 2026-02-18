import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import moment from "moment";
import toast from "react-hot-toast";

const Message = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef();


    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`/api/messages/${id}`);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMessages();

        // Polling for new messages (Simple Real-time)
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);

    }, [id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await axios.post("/api/messages", {
                conversationId: id,
                desc: newMessage,
            });
            setMessages((prev) => [...prev, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
            toast.error("Failed to send message");
        }
    };

    return (
        <div className="flex justify-center min-h-[calc(100vh-100px)] bg-white dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 pt-6">
            <div className="container mx-auto px-4 lg:px-32 flex flex-col h-[85vh]"> {/* Fixed height container */}

                {/* Header */}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                    <Link to="/messages" className="hover:underline">Messages</Link> &gt; <span>{user?.name || "Chat"}</span>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-scroll p-6 bg-gray-50 dark:bg-gray-800 rounded-t-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-4 custom-scrollbar">
                    {isLoading ? "Loading..." : messages.map((m) => (
                        <div
                            key={m._id}
                            className={`flex gap-4 max-w-[80%] ${m.userId === user?._id ? "self-end flex-row-reverse" : "self-start"
                                }`}
                            ref={scrollRef}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${m.userId === user?._id ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
                                {m.userId === user?._id ? "Me" : "U"}
                            </div>
                            <div className={`flex flex-col gap-1 ${m.userId === user?._id ? "items-end" : "items-start"}`}>
                                <p
                                    className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${m.userId === user?._id
                                        ? "bg-primary text-white rounded-tr-none"
                                        : "bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-tl-none text-gray-700 dark:text-gray-200"
                                        }`}
                                >
                                    {m.desc}
                                </p>
                                <span className="text-xs text-gray-400">{moment(m.createdAt).format("LT")}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-gray-800 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg">
                    <form className="flex items-center gap-4" onSubmit={handleSubmit}>
                        <textarea
                            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-primary/50 text-gray-700 dark:text-gray-200 bg-transparent resize-none h-12" // Fixed height for simple input
                            placeholder="Write a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                        ></textarea>
                        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-md font-bold hover:bg-emerald-600 transition">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Message;
