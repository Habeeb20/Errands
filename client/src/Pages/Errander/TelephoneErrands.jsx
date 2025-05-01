import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

function TelephoneErrands() {
    const [requests, setRequests] = useState([]);
    const [bidPrice, setBidPrice] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        socket.emit('joinUserRoom', JSON.parse(atob(token.split('.')[1])).id);

        const fetchRequests = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/requests`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log(data, "data")
                setRequests(data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();

        socket.on('requestPosted', (newRequest) => {
            setRequests(prev => [...prev, newRequest]);
        });

        socket.on('requestUpdated', (updatedRequest) => {
            setRequests(prev => prev.map(req => req._id === updatedRequest._id ? updatedRequest : req));
        });

        socket.on('bidAccepted', (updatedRequest) => {
            setRequests(prev => prev.map(req => req._id === updatedRequest._id ? updatedRequest : req));
        });

        return () => {
            socket.off('requestPosted');
            socket.off('requestUpdated');
            socket.off('bidAccepted');
        };
    }, []);

    const handleBid = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            const price = bidPrice[requestId];
            if (!price) {
                alert('Please enter a bid price');
                return;
            }
            const response = await fetch(`http://localhost:5000/api/requests/${requestId}/bid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ price })
            });
            const data = await response.json();
            if (!response.ok) {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error submitting bid:', error);
            alert('Error submitting bid');
        }
    };

    const handleUpdateStatus = async (requestId, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/requests/${requestId}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            const data = await response.json();
            if (!response.ok) {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Errander Dashboard</h2>
            <h3 className="text-lg font-semibold mb-2">Available Requests</h3>
            {requests?.filter(req => req.status === 'pending').map(req => (
                <div key={req._id} className="border p-4 rounded-lg mb-4">
                    <p><strong>Item:</strong> {req.item}</p>
                    <p><strong>Pickup:</strong> {req.pickup}</p>
                    <p><strong>Destination:</strong> {req.destination}</p>
                    <input
                        type="number"
                        placeholder="Enter your bid price"
                        className="border p-2 rounded mt-2 w-full"
                        onChange={(e) => setBidPrice(prev => ({ ...prev, [req._id]: e.target.value }))}
                    />
                    <button
                        onClick={() => handleBid(req._id)}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Submit Bid
                    </button>
                </div>
            ))}

            <h3 className="text-lg font-semibold mb-2">My Accepted Requests</h3>
            {requests.filter(req => req.erranderId && req.erranderId._id === JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id).map(req => (
                <div key={req._id} className="border p-4 rounded-lg mb-4">
                    <p><strong>Item:</strong> {req.item}</p>
                    <p><strong>Pickup:</strong> {req.pickup}</p>
                    <p><strong>Destination:</strong> {req.destination}</p>
                    <p><strong>Status:</strong> {req.status}</p>
                    {req.status === 'accepted' && (
                        <button
                            onClick={() => handleUpdateStatus(req._id, 'in_progress')}
                            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                        >
                            Start Request
                        </button>
                    )}
                    {req.status === 'in_progress' && (
                        <button
                            onClick={() => handleUpdateStatus(req._id, 'completed')}
                            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Complete Request
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default TelephoneErrands;