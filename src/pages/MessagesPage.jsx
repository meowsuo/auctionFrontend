import { useEffect, useState } from "react";
import axios from "axios";

export default function MessagesPage() {
    const [inbox, setInbox] = useState([]);
    const [sent, setSent] = useState([]);
    const [activeTab, setActiveTab] = useState("inbox");
    const [replyTo, setReplyTo] = useState(null);
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
                    }),
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

    const handleMarkAsRead = async (msg) => {
        if (!msg.unread) return;

        const token = localStorage.getItem("token");

        try {
            await axios.put(`https://auctionbackend-4sb2.onrender.com/api/messages/${msg.id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setInbox(prev =>
                prev.map(m => m.id === msg.id ? { ...m, unread: false } : m)
            );
        } catch (err) {
            console.error("Failed to mark message as read", err);
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.post("https://auctionbackend-4sb2.onrender.com/api/messages", {
                content: replyContent,
                receiverId: replyTo.senderId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            alert("Reply sent!");
            setReplyContent("");
            setReplyTo(null);
        } catch (err) {
            console.error("Failed to send reply", err);
            alert("You can only message sellers you've placed a bid with.");
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex space-x-6 mb-6 border-b pb-2">
                <button
                    onClick={() => setActiveTab("inbox")}
                    className={`pb-1 border-b-2 ${activeTab === "inbox" ? "border-blue-600 font-semibold" : "border-transparent text-gray-600"}`}
                >
                    Inbox {unreadCount > 0 && <span className="text-red-500">({unreadCount})</span>}
                </button>
                <button
                    onClick={() => setActiveTab("sent")}
                    className={`pb-1 border-b-2 ${activeTab === "sent" ? "border-blue-600 font-semibold" : "border-transparent text-gray-600"}`}
                >
                    Sent
                </button>
            </div>

            <ul className="space-y-4">
                {(activeTab === "inbox" ? inbox : sent).map(msg => (
                    <li
                        key={msg.id}
                        className={`p-4 rounded shadow border cursor-pointer hover:bg-gray-50 transition ${
                            msg.unread && activeTab === "inbox" ? "border-blue-400 bg-blue-50" : "border-gray-200"
                        }`}
                        onClick={() => handleMarkAsRead(msg)}
                    >
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">
                                {activeTab === "inbox"
                                    ? `From user ID: ${msg.senderId}`
                                    : `To user ID: ${msg.receiverId}`}
                            </p>
                            {msg.unread && activeTab === "inbox" && (
                                <span className="text-xs text-blue-500 font-semibold">● New</span>
                            )}
                        </div>
                        <p className="mt-1 text-gray-800">{msg.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date(msg.timestamp).toLocaleString()}
                        </p>
                        {activeTab === "inbox" && (
                            <button
                                className="text-sm text-blue-600 underline mt-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setReplyTo(msg);
                                }}
                            >
                                Reply
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {replyTo && (
                <form onSubmit={handleReplySubmit} className="mt-6 border-t pt-4">
                    <h3 className="font-semibold mb-2">Reply to user ID: {replyTo.senderId}</h3>
                    <textarea
                        className="w-full border border-gray-300 rounded p-2"
                        rows={3}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Type your message here..."
                        required
                    />
                    <div className="mt-3 flex space-x-2">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Send
                        </button>
                        <button
                            type="button"
                            onClick={() => setReplyTo(null)}
                            className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
