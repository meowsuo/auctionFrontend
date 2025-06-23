import { useEffect, useState } from 'react';
import axios from 'axios';

function AuctionListPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      axios.get('https://auctionbackend-4sb2.onrender.com/api/auctions', {
          auth: {
              username: 'yourUsername',
              password: 'yourPassword'
          }
      })
        .then(res => {
          setAuctions(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching auctions:", err);
          setLoading(false);
        });
  }, []);

  if (loading) return <p className="text-center mt-4">Loading auctions...</p>;

  return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Auctions</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {auctions.map(auction => (
              <div key={auction.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{auction.title}</h2>
                <p className="text-gray-600">{auction.description}</p>
                <p className="text-sm text-gray-500 mt-2">Starting Price: €{auction.startingPrice}</p>
              </div>
          ))}
        </div>
      </div>
  );
}

export default AuctionListPage;
