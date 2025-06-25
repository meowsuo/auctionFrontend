import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AuctionDetailPage() {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get(`https://auctionbackend-4sb2.onrender.com/api/auctions/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => setAuction(res.data))
            .catch(err => setError("Auction not found or server error."));
    }, [id]);

    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
    if (!auction) return <div className="text-center mt-4">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow mt-4">
            <h1 className="text-2xl font-bold mb-2">{auction.name}</h1>
            <p className="text-gray-600 mb-4">{auction.description}</p>

            <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Category:</strong> {auction.categories.map(c => c.name).join(", ")}</p>
                <p><strong>Starting Price:</strong> €{auction.startingPrice}</p>
                <p><strong>Buyout Price:</strong> €{auction.buyoutPrice}</p>
                <p><strong>Current Price:</strong> €{auction.currentPrice}</p>
                <p><strong>Location:</strong> {auction.location}, {auction.country}</p>
                <p><strong>Start Time:</strong> {new Date(auction.startTime).toLocaleString()}</p>
                <p><strong>End Time:</strong> {new Date(auction.endTime).toLocaleString()}</p>
                <p><strong>Seller:</strong> {auction.seller.username} ({auction.seller.firstName} {auction.seller.lastName})</p>
                <p><strong>Seller Rating:</strong> {auction.seller.ratingAsSeller ?? "N/A"}</p>
            </div>
        </div>
    );
}
