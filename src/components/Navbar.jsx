import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { isLoggedIn, username, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="bg-white shadow p-4 mb-4">
            <div className="container mx-auto flex items-center space-x-4">
                <Link to="/auctions" className="text-blue-600 hover:underline">Auctions</Link>

                {isLoggedIn && (
                    <Link to="/create" className="text-blue-600 hover:underline">Create Auction</Link>
                )}

                <div className="ml-auto flex items-center space-x-4">
                    {isLoggedIn ? (
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
