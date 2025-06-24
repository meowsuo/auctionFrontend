import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const updateFromStorage = () => {
            const token = localStorage.getItem("token");
            const savedUsername = localStorage.getItem("username");
            setUsername(token && savedUsername ? savedUsername : null);
        };

        updateFromStorage(); // Run immediately on first load
        window.addEventListener("storage", updateFromStorage);

        return () => window.removeEventListener("storage", updateFromStorage);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setUsername(null);
        navigate("/");
    };

    return (
        <nav className="bg-white shadow p-4 mb-4">
            <div className="container mx-auto flex items-center space-x-4">
                <Link to="/auctions" className="text-blue-600 hover:underline">Auctions</Link>

                {username && (
                    <Link to="/create" className="text-blue-600 hover:underline">Create Auction</Link>
                )}

                <div className="ml-auto flex items-center space-x-4">
                    {username ? (
                        <>
                            <span className="text-gray-700">Hello, {username}</span>
                            <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 hover:underline">Login</Link>
                            <Link to="/register" className="text-gray-700 hover:underline">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
