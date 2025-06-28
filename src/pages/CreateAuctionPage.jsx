import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateAuctionPage() {
    const navigate = useNavigate();

    const [data, setData] = useState({
        title: "",
        description: "",
        categories: [],
        firstBid: "",
        location: "",
        country: "",
        start: "",
        end: "",
        photo: null
    });

    const [availableCategories, setAvailableCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("https://auctionbackend-4sb2.onrender.com/api/categories", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAvailableCategories(res.data);
            } catch (err) {
                console.error("Failed to load categories:", err);
                alert("Could not load categories. Please check your token.");
            }
        };
        fetchCategories();
    }, []);

    const handleChange = e => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleFileChange = e => {
        setData({ ...data, photo: e.target.files[0] });
    };

    const handleCategoryChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, opt => Number(opt.value));
        setData({ ...data, categories: selected });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            let imageUrl = "";

            // Step 1: Upload image
            if (data.photo) {
                const imageForm = new FormData();
                imageForm.append("file", data.photo);

                const uploadRes = await axios.post(
                    "https://auctionbackend-4sb2.onrender.com/api/images/upload",
                    imageForm,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                // No need for JSON.parse here
                const uploadData = uploadRes.data;
                imageUrl = uploadData.data.link;
            }

            // Step 2: Create auction
            const auctionData = {
                name: data.title,
                description: data.description,
                startingPrice: parseFloat(data.firstBid),
                startTime: data.start,
                endTime: data.end,
                location: data.location,
                country: data.country,
                categoryIds: data.categories
            };

            const auctionRes = await axios.post(
                "https://auctionbackend-4sb2.onrender.com/api/auctions",
                auctionData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const createdAuction = auctionRes.data;

            // Step 3: Save photo to DB if uploaded
            if (imageUrl) {
                await axios.post(
                    "https://auctionbackend-4sb2.onrender.com/api/photos",
                    null,
                    {
                        params: {
                            auctionId: createdAuction.id,
                            url: imageUrl
                        },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }

            navigate('/auctions');
        } catch (err) {
            console.error("Error creating auction:", err);
            if (err.response) {
                console.error("Server responded with:", err.response.data);
                alert(`Failed to create the auction: ${err.response.data}`);
            } else {
                alert("Failed to create the auction. Check console for details.");
            }
        }
    };



    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Create New Auction</h1>
            <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                    <label className="block font-semibold mb-1">Title</label>
                    <input name="title" onChange={handleChange} required
                           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Description</label>
                    <textarea name="description" onChange={handleChange} required rows={4}
                              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Categories</label>
                    <select multiple value={data.categories} onChange={handleCategoryChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200">
                        {availableCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1">First Bid (€)</label>
                    <input name="firstBid" type="number" onChange={handleChange} required
                           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold mb-1">Location</label>
                        <input name="location" onChange={handleChange}
                               className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Country</label>
                        <input name="country" onChange={handleChange}
                               className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" />
                    </div>
                </div>

                <div>
                    <label className="block font-semibold mb-1">Start Time</label>
                    <input name="start" type="datetime-local" onChange={handleChange} required
                           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" />
                </div>

                <div>
                    <label className="block font-semibold mb-1">End Time</label>
                    <input name="end" type="datetime-local" onChange={handleChange} required
                           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Upload Photo</label>
                    <input type="file" onChange={handleFileChange}
                           className="w-full text-sm border rounded px-3 py-2 bg-gray-50" />
                </div>

                <div className="text-center">
                    <button type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow">
                        Submit Auction
                    </button>
                </div>
            </form>
        </div>
    );
}
