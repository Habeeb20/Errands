import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

function TelephoneErrands() {
    const [requests, setRequests] = useState([]);
    const [bidPrice, setBidPrice] = useState({});
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(false); // Added loading state

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
                console.log(data, "data");
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
        setLoading(true); // Start loading
        try {
            const token = localStorage.getItem('token');
            const price = bidPrice[requestId];
            if (!price) {
                alert('Please enter a bid price');
                setLoading(false); // Stop loading
                return;
            }
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/requests/${requestId}/bid`, {
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
                toast.error(data.message || 'Error submitting bid'); // Error toast
            } else {
                toast.success('Bid submitted successfully!'); // Success toast
            }
        } catch (error) {
            console.error('Error submitting bid:', error);
            alert('Error submitting bid');
            toast.error('Error submitting bid'); // Error toast
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleUpdateStatus = async (requestId, status) => {
        setLoading(true); // Start loading
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/requests/${requestId}/status`, {
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
                toast.error(data.message || 'Error updating status'); // Error toast
            } else {
                toast.success('Status updated successfully!'); // Success toast
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status');
            toast.error('Error updating status'); // Error toast
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Calculate stats
    const stats = {
        pending: requests.filter(req => req.status === 'pending').length,
        accepted: requests.filter(req => req.status === 'accepted').length,
        in_progress: requests.filter(req => req.status === 'in_progress').length,
        completed: requests.filter(req => req.status === 'completed').length,
        cancelled: requests.filter(req => req.status === 'cancelled').length,
    };

    const userId = localStorage.getItem('token') && JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;

    return (
        <>
            <style>{`
                .spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: #fff;
                    animation: spin 1s ease-in-out infinite;
                    margin-left: 8px;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
            <div className="min-h-screen bg-gray-100 p-6">
                {/* Header */}
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Errander Dashboard</h2>

                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Pending Requests</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Accepted Requests</h3>
                        <p className="text-3xl font-bold text-green-600">{stats.accepted + stats.in_progress}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Cancelled Requests</h3>
                        <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
                    </div>
                </div>

                {/* Available Requests */}
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Requests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests?.filter(req => req.status === 'pending').map(req => (
                        <div key={req._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
                            <p className="text-gray-700"><strong>Item:</strong> {req.item}</p>
                            <p className="text-gray-700"><strong>Pickup:</strong> {req.pickupLocation}</p>
                            <p className="text-gray-700"><strong>Destination:</strong> {req.dropoffLocation}</p>
                            <p className="text-gray-700"><strong>Quantity:</strong> {req.quantity}</p>
                            <p className="text-gray-700"><strong>Client:</strong> {req.clientId?.firstName || 'Unknown'} {req.clientId?.lastName || 'Unknown'}</p>
                            <button
                                onClick={() => setSelectedRequest(req)}
                                className="mt-2 text-blue-500 hover:underline"
                            >
                                View Details
                            </button>
                            <input
                                type="number"
                                placeholder="Enter your bid price"
                                className="mt-3 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setBidPrice(prev => ({ ...prev, [req._id]: e.target.value }))}
                            />
                            <button
                                onClick={() => handleBid(req._id)}
                                className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex justify-center items-center"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        Submitting... <span className="spinner"></span>
                                    </>
                                ) : (
                                    'Submit Bid'
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {/* My Accepted Requests */}
                <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">My Accepted Requests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.filter(req => req.erranderId && req.erranderId._id === userId).map(req => (
                        <div key={req._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
                            <p className="text-gray-700"><strong>Item:</strong> {req.item}</p>
                            <p className="text-gray-700"><strong>Pickup:</strong> {req.pickupLocation}</p>
                            <p className="text-gray-700"><strong>Destination:</strong> {req.dropoffLocation}</p>
                            <p className="text-gray-700"><strong>Status:</strong> 
                                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                                    req.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    req.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                    req.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {req.status}
                                </span>
                            </p>
                            <button
                                onClick={() => setSelectedRequest(req)}
                                className="mt-2 text-blue-500 hover:underline"
                            >
                                View Details
                            </button>
                            {req.status === 'accepted' && (
                                <button
                                    onClick={() => handleUpdateStatus(req._id, 'in_progress')}
                                    className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex justify-center items-center"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            Starting... <span className="spinner"></span>
                                        </>
                                    ) : (
                                        'Start Request'
                                    )}
                                </button>
                            )}
                            {req.status === 'in_progress' && (
                                <button
                                    onClick={() => handleUpdateStatus(req._id, 'completed')}
                                    className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex justify-center items-center"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            Completing... <span className="spinner"></span>
                                        </>
                                    ) : (
                                        'Complete Request'
                                    )}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Request Details Modal */}
                {selectedRequest && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Request Details</h3>
                            <div className="space-y-2">
                                <p><strong>Item:</strong> {selectedRequest.item}</p>
                                <p><strong>Quantity:</strong> {selectedRequest.quantity}</p>
                                <p><strong>Pickup Location:</strong> {selectedRequest.pickupLocation}</p>
                                <p><strong>Dropoff Location:</strong> {selectedRequest.dropoffLocation}</p>
                                <p><strong>Pickup Time:</strong> {selectedRequest.pickupTime}</p>
                                <p><strong>Pickup Date:</strong> {new Date(selectedRequest.pickupDate).toLocaleDateString()}</p>
                                <p><strong>Client:</strong> {selectedRequest.clientId?.firstName || 'Unknown'}  {selectedRequest.clientId?.lastName || 'Unknown'}</p>
                                <p><strong>Personnel Phone:</strong> {selectedRequest.personnelPhone}</p>
                                <p><strong>Is Order:</strong> {selectedRequest.isOrder ? 'Yes' : 'No'}</p>
                                <p><strong>Needs ID Card:</strong> {selectedRequest.needsIdCard ? 'Yes' : 'No'}</p>
                                <p><strong>Gender Preference:</strong> {selectedRequest.gender}</p>
                                <p><strong>Is Personal:</strong> {selectedRequest.isPersonal}</p>
                                <p><strong>Needs Car:</strong> {selectedRequest.needsCar ? 'Yes' : 'No'}</p>
                                {selectedRequest.needsCar && <p><strong>Vehicle Type:</strong> {selectedRequest.vehicleType}</p>}
                                <p><strong>Is Perishable:</strong> {selectedRequest.isPerishable ? 'Yes' : 'No'}</p>
                                <p><strong>Status:</strong> {selectedRequest.status}</p>
                                {selectedRequest.picture  && (
                                    <div>
                                        <strong>Picture:</strong>
                                        <img src={selectedRequest.picture} alt="Request" className="mt-2 max-w-full rounded-lg" />
                                    </div>
                                )}
                                {selectedRequest.picture1 && (
                                    <div>
                                        <strong>Additional Picture:</strong>
                                        <img src={selectedRequest.picture1} alt="Request" className="mt-2 max-w-full rounded-lg" />
                                    </div>
                                )}
                                {selectedRequest.cancellation && (
                                    <div>
                                        <strong>Cancellation Details:</strong>
                                        <p><strong>Reason:</strong> {selectedRequest.cancellation.reason}</p>
                                        <p><strong>Cancelled By:</strong> {selectedRequest.cancellation.cancelledBy}</p>
                                        <p><strong>Cancelled At:</strong> {new Date(selectedRequest.cancellation.cancelledAt).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="mt-6 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
        </>
    );
}

export default TelephoneErrands;