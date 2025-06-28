import { useEffect, useState } from "react";
import axios from "axios";

export default function MessagesPage() {
    const [inbox, setInbox] = useState([]);
    const [sent, setSent] = useState([]);
    const [activeTab, setActiveTab] = useState("inbox");
    const [replyTo, setReplyTo] = useState(null); // message being replied to
    const [replyContent, setReplyContent] = useState("");

    const handleMarkAsRead = async (msg) => {
        if (!msg.unread) return; // Skip if already read

        const token = localStorage.getItem("token");

        try {
            await axios.put(`https://auctionbackend-4sb2.onrender.com/api/messages/${msg.id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state to mark the message as read
            setInbox(prev =>
                prev.map(m => m.id === msg.id ? { ...m, unread: false } : m)
            );
        } catch (err) {
            console.error("Failed to mark message as read", err);
        }
    };

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

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.post("https://auctionbackend-4sb2.onrender.com/api/messages", {
                content: replyContent,
                receiverId: replyTo.sender.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            alert("Message sent!");
            setReplyTo(null);
            setReplyContent("");
        } catch (err) {
            console.error("Failed to send reply", err);
            alert("Failed to send message. You must have bid on their auction.");
        }
    };

    return (
        <div className="p-4">
            <div className="flex space-x-4 mb-4">
                <button onClick={() => setActiveTab("inbox")} className={activeTab === "inbox" ? "font-bold" : ""}>
                    Inbox {unreadCount > 0 && <span className="text-red-500">({unreadCount})</span>}
                </button>
                <button onClick={() => setActiveTab("sent")} className={activeTab === "sent" ? "font-bold" : ""}>
                    Sent
                </button>
            </div>

            <ul>
                {(activeTab === "inbox" ? inbox : sent).map(msg => (
                    <li
                        key={msg.id}
                        className="border-b py-2 cursor-pointer"
                        onClick={() => handleMarkAsRead(msg)}
                    >
                        <p>
                            <strong>{msg.content}</strong>{" "}
                            {msg.unread && activeTab === "inbox" && (
                                <span className="text-blue-500 text-xs">(new)</span>
                            )}
                        </p>
                        <p className="text-sm text-gray-500">
                            {new Date(msg.timestamp).toLocaleString()}
                        </p>
                        {activeTab === "inbox" && (
                            <button
                                className="text-sm text-indigo-600 underline mt-1"
                                onClick={() => setReplyTo(msg)}
                            >
                                Reply
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {replyTo && (
                <form onSubmit={handleReplySubmit} className="mt-4 border-t pt-4">
                    <h3 className="font-semibold">Reply to {replyTo.sender.username}:</h3>
                    <textarea
                        className="w-full border p-2 mt-2"
                        rows={3}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        required
                    />
                    <div className="mt-2 flex space-x-2">
                        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                            Send
                        </button>
                        <button type="button" onClick={() => setReplyTo(null)} className="text-gray-500">
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
