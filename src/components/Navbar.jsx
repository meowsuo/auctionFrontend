import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);
    const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };
  return (
    <nav className="bg-white shadow p-4 mb-4">
      <div className="container mx-auto flex items-center space-x-4">
        <Link to="/auctions" className="text-blue-600 hover:underline">Auctions</Link>
        {user && <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>}
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700">Γεια σου, {user.username}</span>
              <button onClick={handleLogout} className="text-red-600 hover:underline">Αποσύνδεση</button>
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