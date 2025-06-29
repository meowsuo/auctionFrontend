import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EditAuctionPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [auction, setAuction] = useState(null);
    const [description, setDescription] = useState("");
    const [endTime, setEndTime] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await api.get(`/api/auctions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setAuction(res.data);
                setDescription(res.data.description);
                setEndTime(res.data.endTime.substring(0, 16)); // format for datetime-local
            } catch (err) {
                console.error(err);
                setError("Failed to fetch auction");
            }
        };

        fetchAuction();
    }, [id]);

    const handleSave = async () => {
        if (!description || !endTime) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await api.put(`/api/auctions/${id}`, {
                description,
                endTime
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate("/my-auctions");
        } catch (err) {
            console.error(err);
            alert("Failed to update auction.");
        }
};

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this auction?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("You must be logged in to delete an auction.");
                return;
            }

            await api.delete(`/api/auctions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            navigate("/my-auctions");
        } catch (err) {
            console.error("Delete failed:", err);
            const msg = err.response?.data?.message || "Failed to delete auction.";
            alert(msg);
        }
    };


    if (!auction) return <p>Loading...</p>;

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Auction: {auction.name}</h1>
            {error && <p className="text-red-600">{error}</p>}
            <div className="space-y-4">
                <div>
                    <label>Description:</label>
                    <textarea
                        className="w-full border p-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>End Time:</label>
                    <input
                        type="datetime-local"
                        className="w-full border p-2"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>
                <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Save Changes
                </button>
                <button onClick={handleDelete} className="text-red-600 ml-4 hover:underline">
                    Delete Auction
                </button>
            </div>
        </div>
    );
}
