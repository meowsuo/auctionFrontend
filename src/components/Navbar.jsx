import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Mail } from 'lucide-react';
import api from '../services/api';

function Navbar() {
    const { isLoggedIn, username, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchUnreadStatus = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await api.get('/api/messages/unread/count', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status === 200) {
                    const count = await res.data;
                    setHasUnread(count > 0);
                }
            } catch (err) {
                console.error("Failed to fetch unread count", err);
            }
        };

        if (isLoggedIn) {
            fetchUnreadStatus();
        }
    }, [isLoggedIn]);

    return (
        <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo / Home */}
                    <Link to="/auctions" className="text-lg font-bold text-blue-600 hover:underline">
                        Auctions
                    </Link>

                    {isLoggedIn ? (
                        <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
                            <span className="text-sm text-gray-700">Hello, {username}</span>

                            {/* Messages icon link with red dot if unread */}
                            <Link
                                to="/messages"
                                className="relative text-gray-700 hover:text-blue-600"
                                title="Messages"
                            >
                                <Mail className="w-5 h-5" />
                                {hasUnread && (
                                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
                                )}
                            </Link>

                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
                            >
                                Menu
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-12 w-48 bg-white border rounded shadow-md z-50">
                                    <Link
                                        to="/my-auctions"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        My Auctions
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <Link to="/login" className="text-sm text-gray-700 hover:underline">Login</Link>
                            <Link to="/register" className="text-sm text-gray-700 hover:underline">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
