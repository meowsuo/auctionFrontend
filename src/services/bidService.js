import api from './api';

const API_URL = '/api/bids';

export const createBid = async (amount, auctionId) => {
    const token = localStorage.getItem("token");

    try {
        const response = await api.post(
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
