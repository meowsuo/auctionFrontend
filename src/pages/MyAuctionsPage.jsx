import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function MyAuctionsPage() {
    const [auctions, setAuctions] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchMyAuctions = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token being sent:", token);

            const res = await axios.get("https://auctionbackend-4sb2.onrender.com/api/auctions/my-auctions", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAuctions(res.data);

            setAuctions(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load your auctions.");
        }
    };

    useEffect(() => {
        fetchMyAuctions();
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://auctionbackend-4sb2.onrender.com/api/auctions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAuctions(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete auction.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">My Auctions</h1>

            {error && <p className="text-red-600">{error}</p>}

            {auctions.length === 0 ? (
                <p>No auctions found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {auctions.map(auction => {
                        const hasStarted = new Date(auction.startTime) <= new Date();
                        const hasBids = auction.currentPrice > auction.startingPrice;

                        return (
                            <div key={auction.id} className="bg-white p-4 rounded shadow">
                                <h2 className="text-lg font-semibold">{auction.name}</h2>
                                <p className="text-sm text-gray-600">{auction.description}</p>
                                <p className="text-sm">Starts: {new Date(auction.startTime).toLocaleString()}</p>
                                <p className="text-sm">Ends: {new Date(auction.endTime).toLocaleString()}</p>
                                <p className="text-sm">Current Price: €{auction.currentPrice}</p>

                                <div className="flex gap-4 mt-2">
                                    {!hasStarted && !hasBids && (
                                        <button
                                            onClick={() => handleDelete(auction.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    )}

                                    <button
                                        onClick={() => navigate(`/edit-auction/${auction.id}`)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>

                        );
                    })}
                </div>
            )}
        </div>
    );
}
