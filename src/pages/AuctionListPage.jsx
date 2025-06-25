import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

function AuctionListPage() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Using token:", token); // ✅ Debug

        axios.get('https://auctionbackend-4sb2.onrender.com/api/auctions', {
            headers: {
                Authorization: `Bearer ${token}` // ✅ Set JWT here
            }
        })
            .then(res => {
                setAuctions(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching auctions:", err);
                setError('Failed to load auctions. Please log in again or try later.');
                setLoading(false);
            });
    }, []);


    // NEW: Function to delete auction
    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://auctionbackend-4sb2.onrender.com/api/auctions/${id}`);
            setAuctions(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    if (loading) return <p className="text-center mt-4">Loading auctions...</p>;
    if (error) return <p className="text-center mt-4 text-red-600">{error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Auctions</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {auctions.map(auction => {
                    const bidCount = auction.bids?.length || 0;
                    const canDelete = new Date(auction.start) > new Date() && bidCount === 0;

                    return (
                        <div key={auction.id} className="bg-white p-4 rounded shadow">
                            <Link to={`/auctions/${auction.id}`}>
                                <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                                    {auction.name}
                                </h2>
                            </Link>
                            <p className="text-gray-600">{auction.description}</p>
                            <p className="text-sm text-gray-500 mt-2">Starting Price: €{auction.startingPrice}</p>

                            {/* NEW: Show number of bids */}
                            <p className="text-sm mt-1 text-gray-600">Bids: {bidCount}</p>

                            {/* NEW: Show delete button if eligible */}
                            {canDelete && (
                                <button
                                    onClick={() => handleDelete(auction.id)}
                                    className="mt-2 text-red-600 hover:underline"
                                >
                                    Delete Auction
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default AuctionListPage;
