import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateAuctionPage() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        title: "", description: "", categories: "", firstBid: "",
        location: "", country: "", start: "", end: "", photo: null
    });

    const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

    const handleFileChange = e => setData({ ...data, photo: e.target.files[0] });

    const handleSubmit = async e => {
        e.preventDefault();

        const formData = new FormData();
        for (let key in data) {
            formData.append(key, data[key]);
        }

        try {
            const token = localStorage.getItem("token");

            await axios.post("https://.../api/auctions", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/auctions');
        } catch (err) {
            console.error("Error creating auction:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Create Auction</h1>

            <input name="title" placeholder="Name" onChange={handleChange} required className="input mb-2" />
            <input name="categories" placeholder="Categories (comma separated)" onChange={handleChange} required className="input mb-2" />
            <input name="firstBid" type="number" placeholder="First Bid" onChange={handleChange} required className="input mb-2" />
            <input name="location" placeholder="Location" onChange={handleChange} className="input mb-2" />
            <input name="country" placeholder="Country" onChange={handleChange} className="input mb-2" />
            <input name="start" type="datetime-local" onChange={handleChange} required className="input mb-2" />
            <input name="end" type="datetime-local" onChange={handleChange} required className="input mb-2" />
            <textarea name="description" placeholder="Description" onChange={handleChange} required className="textarea mb-2" />
            <input type="file" onChange={handleFileChange} className="mb-2" />
            <button type="submit" className="btn">Submit</button>
        </form>
    );
}
