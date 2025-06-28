import { useEffect, useState } from "react";
import axios from "axios";

export default function MessagesPage() {
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState(null);
    const [activeTab, setActiveTab] = useState("inbox");

    useEffect(() => {
        const fetchMessages = async () => {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://auctionbackend-4sb2.onrender.com/api/messages", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);

            // Decode user ID from token (assuming 'id' is in the payload)
            const decoded = JSON.parse(atob(token.split(".")[1]));
            setUserId(decoded.id);
        };

        fetchMessages();
    }, []);

    const inbox = messages.filter(m => m.receiver_id === String(userId));
    const sent = messages.filter(m => m.sender_id === String(userId));
    const unreadCount = inbox.filter(m => m.is_unread).length;

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
                            {msg.is_unread && activeTab === "inbox" && <span className="text-blue-500 text-xs">(new)</span>}
                        </p>
                        <p className="text-sm text-gray-500">{new Date(msg.timestamp).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
