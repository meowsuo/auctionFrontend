import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

function AuctionListPage() {
    const [auctions, setAuctions] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [auctionsRes, categoriesRes] = await Promise.all([
                    axios.get('https://auctionbackend-4sb2.onrender.com/api/auctions'),
                    axios.get('https://auctionbackend-4sb2.onrender.com/api/categories')
                ]);

                setAuctions(auctionsRes.data);
                const categoryNames = categoriesRes.data.map(c => c.name);
                setCategories(["All", ...categoryNames]);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError('Failed to load auctions or categories. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredAuctions = selectedCategory === "All"
        ? auctions
        : auctions.filter(a => a.category === selectedCategory);

    if (loading) return <p className="text-center mt-4">Loading auctions...</p>;
    if (error) return <p className="text-center mt-4 text-red-600">{error}</p>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-800">Auctions</h1>
                {localStorage.getItem("token") && (
                    <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                        + Create Auction
                    </Link>
                )}
            </div>

            <div className="mb-6">
                <label className="block mb-1 text-sm font-medium text-gray-700">Filter by Category:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2"
                >
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAuctions.map(auction => {
                    const now = new Date();
                    const start = new Date(auction.startTime);
                    const end = new Date(auction.endTime);

                    let status = "Upcoming";
                    let badgeColor = "bg-yellow-100 text-yellow-800";
                    if (now >= start && now <= end) {
                        status = "Active";
                        badgeColor = "bg-green-100 text-green-800";
                    } else if (now > end) {
                        status = "Ended";
                        badgeColor = "bg-red-100 text-red-800";
                    }

                    return (
                        <Link
                            key={auction.id}
                            to={`/auctions/${auction.id}`}
                            className="block rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition duration-300 p-4"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-semibold text-blue-600">{auction.name}</h2>
                                <span className={`text-xs font-medium px-2 py-1 rounded ${badgeColor}`}>
                                    {status}
                                </span>
                            </div>

                            <p className="text-sm text-gray-500 line-clamp-3 mb-3">{auction.description}</p>

                            <div className="text-sm text-gray-700 space-y-1">
                                <p><strong>Starting:</strong> €{auction.startPrice}</p>
                                <p><strong>Current:</strong> €{auction.currentPrice}</p>
                                <p><strong>Bids:</strong> {auction.bidCounts}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default AuctionListPage;
