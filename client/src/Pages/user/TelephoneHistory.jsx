import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

function TelephoneHistory() {
    const [requests, setRequests] = useState([]);

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
                setRequests(data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();

        socket.on('requestUpdated', (updatedRequest) => {
            setRequests(prev => prev.map(req => req._id === updatedRequest._id ? updatedRequest : req));
        });

        return () => {
            socket.off('requestUpdated');
        };
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Requests</h2>
            {requests.length === 0 ? (
                <p>No requests found.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {requests.map(req => (
                        <div key={req._id} className="border p-4 rounded-lg">
                            <p><strong>Item:</strong> {req.item}</p>
                            <p><strong>Pickup:</strong> {req.pickup}</p>
                            <p><strong>Destination:</strong> {req.destination}</p>
                            <p><strong>Status:</strong> {req.status}</p>
                            {req.erranderId && (
                                <p><strong>Errander:</strong> {req.erranderId.firstName} {req.erranderId.lastName}</p>
                            )}
                            {req.cancellation && (
                                <p><strong>Cancellation Reason:</strong> {req.cancellation.reason}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TelephoneHistory;