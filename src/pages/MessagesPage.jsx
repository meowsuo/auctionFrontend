import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";

export default function MessagesPage() {
    const [inbox, setInbox] = useState([]);
    const [sent, setSent] = useState([]);
    const [activeTab, setActiveTab] = useState("inbox");
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            const token = localStorage.getItem("token");

            try {
                const [inboxRes, sentRes] = await Promise.all([
                    axios.get("https://auctionbackend-4sb2.onrender.com/api/messages/received", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("https://auctionbackend-4sb2.onrender.com/api/messages/sent", {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setInbox(inboxRes.data);
                setSent(sentRes.data);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };

        fetchMessages();
    }, []);

    const unreadCount = inbox.filter(m => m.unread).length;

    const handleSelectMessage = async (msg) => {
        setSelectedMessage(msg);

        if (msg.unread) {
            try {
                const token = localStorage.getItem("token");
                await axios.put(`https://auctionbackend-4sb2.onrender.com/api/messages/${msg.id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Update local state
                setInbox(prev =>
                    prev.map(m => (m.id === msg.id ? { ...m, unread: false } : m))
                );
            } catch (err) {
                console.error("Failed to mark as read", err);
            }
        }
    };

    const handleReply = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("https://auctionbackend-4sb2.onrender.com/api/messages", {
                content: replyContent,
                receiverId: selectedMessage.senderId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setReplyContent("");
            setIsReplyOpen(false);
        } catch (err) {
            console.error("Failed to send reply", err);
        }
    };

    const messages = activeTab === "inbox" ? inbox : sent;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab("inbox")}
                    className={`px-4 py-2 rounded ${activeTab === "inbox" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                    Inbox {unreadCount > 0 && <span className="ml-1 text-sm text-red-400">({unreadCount})</span>}
                </button>
                <button
                    onClick={() => setActiveTab("sent")}
                    className={`px-4 py-2 rounded ${activeTab === "sent" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                    Sent
                </button>
            </div>

            <ul className="space-y-2">
                {messages.map(msg => (
                    <motion.li
                        key={msg.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded border shadow-sm cursor-pointer hover:bg-gray-50 transition-all ${
                            msg.unread && activeTab === "inbox" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                        onClick={() => handleSelectMessage(msg)}
                    >
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-800">
                                {msg.content}
                            </p>
                            {msg.unread && activeTab === "inbox" && (
                                <span className="text-xs text-blue-600 font-semibold">● New</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date(msg.timestamp).toLocaleString()}
                        </p>
                        {activeTab === "inbox" && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsReplyOpen(true);
                                }}
                                className="mt-2 text-sm text-blue-500 hover:underline"
                            >
                                Reply
                            </button>
                        )}
                    </motion.li>
                ))}
            </ul>

            {/* Reply Modal */}
            <Dialog open={isReplyOpen} onClose={() => setIsReplyOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded p-6 w-full max-w-md shadow-lg">
                        <Dialog.Title className="text-lg font-bold mb-2">Reply to Message</Dialog.Title>
                        <textarea
                            className="w-full border border-gray-300 rounded p-2 mb-4"
                            rows="4"
                            placeholder="Type your reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => setIsReplyOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={handleReply}
                            >
                                Send
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
