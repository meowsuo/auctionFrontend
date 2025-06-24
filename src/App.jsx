import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuctionListPage from './pages/AuctionListPage';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';
import CreateAuctionPage from './pages/CreateAuctionPage';

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/auctions" />} />
                <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
                <Route path="/auctions" element={<AuctionListPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/create" element={<ProtectedRoute><CreateAuctionPage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/auctions" />} />
            </Routes>
        </div>
    );
}

export default App;
