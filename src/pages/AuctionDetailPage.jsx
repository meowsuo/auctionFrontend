import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AuctionDetailPage() {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`https://auctionbackend-4sb2.onrender.com/api/auctions/${id}`)
            .then(res => setAuction(res.data))
            .catch(err => setError("Auction not found or server error."));
    }, [id]);

    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
    if (!auction) return <div className="text-center mt-4">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow mt-4">
            <h1 className="text-2xl font-bold mb-2">{auction.name}</h1>
            <p className="text-gray-600">{auction.description}</p>

            <div className="mt-4 space-y-1">
                <p><strong>Κατηγορία:</strong> {auction.categories.join(", ")}</p>
                <p><strong>Τιμή Εκκίνησης:</strong> ${auction.firstBid}</p>
                <p><strong>Τρέχουσα Τιμή:</strong> ${auction.currently}</p>
                <p><strong>Τοποθεσία:</strong> {auction.location}, {auction.country}</p>
                <p><strong>Έναρξη:</strong> {new Date(auction.started).toLocaleString()}</p>
                <p><strong>Λήξη:</strong> {new Date(auction.ends).toLocaleString()}</p>
                <p><strong>Πωλητής:</strong> {auction.seller.userID} (Rating: {auction.seller.rating})</p>
            </div>

            {/* You can later add a BidForm component here */}
        </div>
    );
}
