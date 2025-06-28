import { useEffect, useState } from "react";
import axios from "axios";

export default function MessagesPage() {
    const [inbox, setInbox] = useState([]);
    const [sent, setSent] = useState([]);
    const [activeTab, setActiveTab] = useState("inbox");

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
                    <li key={msg.id} className="border-b py-2">
                        <p>
                            <strong>{msg.content}</strong>{" "}
                            {msg.unread && activeTab === "inbox" && (
                                <span className="text-blue-500 text-xs">(new)</span>
                            )}
                        </p>
                        <p className="text-sm text-gray-500">
                            {new Date(msg.timestamp).toLocaleString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
