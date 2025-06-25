import axios from 'axios';

const API_URL = 'https://auctionbackend-4sb2.onrender.com/api/bids';

export const createBid = async (amount, auctionId) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.post(
            API_URL,
            { amount, auctionId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating bid:', error);
        throw error;
    }
};
