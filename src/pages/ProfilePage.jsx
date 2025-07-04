import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        location: "",
        taxNumber: "",
        ratingAsSeller: 0,
        ratingAsBidder: 0
    });

    const token = localStorage.getItem("token");
    let username = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            username = decoded.sub || decoded.username || decoded.userId || decoded.id;
        } catch (err) {
            console.error("Invalid token", err);
        }
    }

    useEffect(() => {
        if (!username) return;

        const fetchUser = async () => {
            try {
                const res = await api.get(`/api/users/username/${username}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                setFormData({
                    username: res.data.username || "",
                    firstName: res.data.firstName || "",
                    lastName: res.data.lastName || "",
                    email: res.data.email || "",
                    phone: res.data.phone || "",
                    address: res.data.address || "",
                    location: res.data.location || "",
                    taxNumber: res.data.taxNumber || "",
                    ratingAsSeller: res.data.ratingAsSeller || 0,
                    ratingAsBidder: res.data.ratingAsBidder || 0
                });
            } catch (err) {
                console.error("Failed to fetch user profile", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/users/username/${username}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update profile", err);
            alert("Update failed");
        }
    };

    if (isLoading) return <p className="p-4">Loading profile...</p>;
    if (!user) return <p className="p-4 text-red-500">Failed to load user profile</p>;

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                           className="w-full mt-1 p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                           className="w-full mt-1 p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                           className="w-full mt-1 p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                           className="w-full mt-1 p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange}
                           className="w-full mt-1 p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange}
                           className="w-full mt-1 p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tax Number</label>
                    <input type="text" name="taxNumber" value={formData.taxNumber} onChange={handleChange}
                           className="w-full mt-1 p-2 border rounded" />
                </div>

                {/* Hidden or disabled fields */}
                <input type="hidden" name="username" value={formData.username} />
                <input type="hidden" name="ratingAsSeller" value={formData.ratingAsSeller} />
                <input type="hidden" name="ratingAsBidder" value={formData.ratingAsBidder} />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
}
