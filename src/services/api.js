import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://auctionbackend-4sb2.onrender.com/api',
});

export default api;
