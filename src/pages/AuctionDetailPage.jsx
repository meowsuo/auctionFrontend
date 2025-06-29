import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { createBid } from "../services/bidService";
import api from "../services/api";

export default function AuctionDetailPage() {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [bids, setBids] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState("");

    const fetchAuctionAndBids = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");

            const [auctionRes, bidsRes, photosRes] = await Promise.all([
                api.get(`/api/auctions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                api.get(`/api/bids`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                api.get(`/api/photos/auction/${id}`)
            ]);

            setAuction(auctionRes.data);
            setBids(bidsRes.data.filter(b => b.auctionId === Number(id)));
            setPhotos(photosRes.data);
        } catch (err) {
            console.error(err);
            setError("Auction not found or server error.");
        }
    }, [id]);

    useEffect(() => {
        fetchAuctionAndBids();
    }, [fetchAuctionAndBids]);

    const handleBuyout = async () => {
        const confirmed = window.confirm(`Are you sure you want to buy out "${auction.name}" for €${auction.buyoutPrice}?`);
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");

            // Step 1: Place a bid with the buyout price
            await createBid(auction.buyoutPrice, auction.id);

            // Step 2: Trigger the buyout (end the auction)
            await api.put(
                `/api/auctions/${id}/end`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await fetchAuctionAndBids(); // Refresh UI
        } catch (err) {
            console.error("Buyout failed:", err.response?.data || err.message);
            setError("Buyout failed.");
        }
    };

    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
    if (!auction) return <div className="text-center mt-4">Loading...</div>;

    const isEnded = auction.status === "Ended";

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow mt-4">
            <h1 className="text-2xl font-bold mb-2">{auction.name}</h1>
            <p className="text-gray-600 mb-4">{auction.description}</p>

            <div className="space-y-2 text-sm text-gray-700 mb-6">
                <p><strong>Category:</strong> {auction.categories.map(c => c.name).join(", ")}</p>
                <p><strong>Starting Price:</strong> €{auction.startingPrice}</p>
                <p><strong>Buyout Price:</strong> €{auction.buyoutPrice}</p>
                <p><strong>Current Price:</strong> €{auction.currentPrice}</p>
                <p><strong>Status:</strong> {auction.status}</p>
                <p><strong>Location:</strong> {auction.location}, {auction.country}</p>
                <p><strong>Start Time:</strong> {new Date(auction.startTime).toLocaleString()}</p>
                <p><strong>End Time:</strong> {new Date(auction.endTime).toLocaleString()}</p>
                <p><strong>Seller:</strong> {auction.seller.name} {auction.seller.lastName}</p>
                <p><strong>Seller Rating:</strong> {auction.seller.rating ?? "N/A"}</p>
                <p><strong>Number of Bids:</strong> {auction.bidCount}</p>
            </div>

            {/* Photos Section */}
            {photos.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Photos</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {photos.map(photo => (
                            <img
                                key={photo.id}
                                src={photo.url}
                                alt="Auction"
                                className="w-full h-auto rounded shadow"
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Buyout Button */}
            {!isEnded && (
                <div className="mb-6">
                    <button
                        onClick={handleBuyout}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Buyout Now
                    </button>
                </div>
            )}

            {/* Bid Form */}
            {!isEnded && (
                <div className="border-t pt-4 mt-6">
                    <h2 className="text-lg font-semibold mb-2">Place a Bid</h2>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.target;
                            const bidAmount = parseFloat(form.elements.amount.value);

                            if (isNaN(bidAmount) || bidAmount <= auction.currentPrice) {
                                alert("Bid must be higher than the current price.");
                                return;
                            }

                            const confirmBid = window.confirm(`Confirm your bid of €${bidAmount}?`);
                            if (!confirmBid) return;

                            try {
                                await createBid(bidAmount, auction.id);
                                form.reset();
                                await fetchAuctionAndBids();
                            } catch (err) {
                                console.error(err);
                                alert("Failed to place bid.");
                            }
                        }}
                        className="space-y-2"
                    >
                        <input
                            name="amount"
                            type="number"
                            step="0.01"
                            placeholder="Your bid (€)"
                            className="border p-2 rounded w-full"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Submit Bid
                        </button>
                    </form>
                </div>
            )}

            {/* Bid History */}
            {bids.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-2">Bid History</h2>
                    <ul className="space-y-1 text-sm text-gray-800">
                        {bids
                            .sort((a, b) => new Date(b.time) - new Date(a.time))
                            .map(bid => (
                                <li key={bid.id} className="border-b py-1">
                                    <div><span className="font-medium">€{bid.amount}</span> by {bid.bidderFullName} (Rating: {bid.bidderRating ?? "N/A"})</div>
                                    <div className="text-sm text-gray-600">Location: {bid.bidderLocation ?? "N/A"}</div>
                                    <div className="text-sm text-gray-600">Time: {new Date(bid.time).toLocaleString()}</div>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
}