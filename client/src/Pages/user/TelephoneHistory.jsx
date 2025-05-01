
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FaTimes, FaUser, FaMapMarkerAlt, FaBox, FaCalendar, FaPhone, FaCar, FaImage } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

function TelephoneHistory() {
  const [requests, setRequests] = useState([]);
  const [isErranderModalOpen, setIsErranderModalOpen] = useState(false);
  const [selectedErrander, setSelectedErrander] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const userId = JSON.parse(atob(token.split('.')[1])).id;
    socket.emit('joinUserRoom', userId);

    const fetchRequests = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();

    socket.on('requestUpdated', (updatedRequest) => {
      setRequests((prev) => prev.map((req) => (req._id === updatedRequest._id ? updatedRequest : req)));
    });

    return () => {
      socket.off('requestUpdated');
    };
  }, []);

  // Calculate statistics for requests
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((req) => req.status === 'pending').length;
  const acceptedRequests = requests.filter((req) => req.status === 'accepted' || req.status === 'in_progress').length;
  const cancelledRequests = requests.filter((req) => req.status === 'cancelled').length;
  const completedRequests = requests.filter((req) => req.status === 'completed').length;

  const pendingPercentage = totalRequests > 0 ? Math.round((pendingRequests / totalRequests) * 100) : 0;
  const acceptedPercentage = totalRequests > 0 ? Math.round((acceptedRequests / totalRequests) * 100) : 0;
  const cancelledPercentage = totalRequests > 0 ? Math.round((cancelledRequests / totalRequests) * 100) : 0;
  const completedPercentage = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0;

  // Data for Requests Breakdown (Doughnut Chart)
  const requestsData = {
    labels: ['Completed', 'Accepted', 'Cancelled', 'Pending'],
    datasets: [
      {
        data: [completedPercentage, acceptedPercentage, cancelledPercentage, pendingPercentage],
        backgroundColor: ['#4A90E2', '#50C878', '#FF6B6B', '#F5E050'],
        borderWidth: 0,
      },
    ],
  };

  const handleViewErrander = (errander) => {
    setSelectedErrander(errander);
    setIsErranderModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">My Requests</h2>

      {/* Statistics Section */}
      <div className="mb-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Request Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-3">
              <FaBox className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Requests</p>
              <p className="text-xl font-bold text-gray-800">{totalRequests}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-3">
              <FaUser className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Accepted</p>
              <p className="text-xl font-bold text-gray-800">{acceptedRequests}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
            <div className="p-3 bg-red-100 rounded-lg mr-3">
              <FaTimes className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Cancelled</p>
              <p className="text-xl font-bold text-gray-800">{cancelledRequests}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg mr-3">
              <FaBox className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-xl font-bold text-gray-800">{pendingRequests}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Requests Breakdown</h4>
          <div className="relative w-40 h-40 mx-auto">
            <Doughnut
              data={requestsData}
              options={{
                cutout: '70%',
                plugins: {
                  legend: { display: false },
                },
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-800">{completedPercentage}%</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600 text-sm">Completed: {completedPercentage}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600 text-sm">Accepted: {acceptedPercentage}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600 text-sm">Cancelled: {cancelledPercentage}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-gray-600 text-sm">Pending: {pendingPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <p className="text-gray-600 text-center">No requests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-gray-800">{req.item}</h3>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    req.status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : req.status === 'accepted' || req.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-600'
                      : req.status === 'cancelled'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-500" />
                  <strong>Pickup:</strong> {req.pickupLocation}
                </p>
                <p className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-500" />
                  <strong>Destination:</strong> {req.dropoffLocation}
                </p>
                <p className="flex items-center">
                  <FaBox className="mr-2 text-gray-500" />
                  <strong>Quantity:</strong> {req.quantity}
                </p>
                <p className="flex items-center">
                  <FaCalendar className="mr-2 text-gray-500" />
                  <strong>Pickup Date:</strong> {new Date(req.pickupDate).toLocaleDateString()}
                </p>
                <p className="flex items-center">
                  <FaPhone className="mr-2 text-gray-500" />
                  <strong>Contact:</strong> {req.personnelPhone}
                </p>
                {req.needsCar && (
                  <p className="flex items-center">
                    <FaCar className="mr-2 text-gray-500" />
                    <strong>Vehicle:</strong> {req.vehicleType || 'Any'}
                  </p>
                )}
                {(req.picture || req.picture1) && (
                  <p className="flex items-center">
                    <FaImage className="mr-2 text-gray-500" />
                    <strong>Images:</strong>
                    <span className="ml-1">
                      {req.picture && (
                        <a href={req.picture} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          View
                        </a>
                      )}
                      {req.picture1 && (
                        <a href={req.picture1} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-2">
                          View
                        </a>
                      )}
                    </span>
                  </p>
                )}
                {req.cancellation && (
                  <p className="text-red-600">
                    <strong>Cancellation Reason:</strong> {req.cancellation.reason}
                  </p>
                )}
                {(req.status === 'accepted' || req.status === 'in_progress') && req.erranderId && (
                  <button
                    onClick={() => handleViewErrander(req.erranderId)}
                    className="mt-2 text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    View Errander Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Errander Details Modal */}
      {isErranderModalOpen && selectedErrander && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Errander Details</h3>
              <button onClick={() => setIsErranderModalOpen(false)}>
                <FaTimes className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Name:</strong> {selectedErrander.firstName} {selectedErrander.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedErrander.email}
              </p>
              <p>
                <strong>Role:</strong> {selectedErrander.role}
              </p>
            </div>
            <button
              onClick={() => setIsErranderModalOpen(false)}
              className="mt-4 w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TelephoneHistory;
