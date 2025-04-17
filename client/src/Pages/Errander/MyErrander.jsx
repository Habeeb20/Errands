import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaChartBar, FaHotel, FaCar, FaPlane, FaUser, FaEye  } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import io from 'socket.io-client';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

// Initialize Socket.IO client
const socket = io(import.meta.env.VITE_BACKEND_URL);

function MyErrander() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({
    userEmail: '',
    age: '',
    gender: '',
    dateOfBirth: '',
    state: '',
    LGA: '',
    address: '',
    maritalStatus: '',
    WDYD: '',
    profilePicture: '',
    driverLicense: '',
    NIN: '',
    medicalCondition: '',
    alcoholUse: '',
    height: '',
    weight: '',
    referenceAddress: '',
    referenceContact: '',
    referenceOccupation: '',
    numberOfWives: '',
    addressOfSpouse: '',
    numberOfChildren: '',
  });

  const navigate = useNavigate();
  const location = useLocation();

  const [bookings, setBookings] = useState([]); // Store all bookings for the errander
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]); // Store errand history
  const [notifications, setNotifications] = useState([]);
  const [trackingErrand, setTrackingErrand] = useState(null);
  const [erranderPosition, setErranderPosition] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // For tabbed history view

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const AnimatedSection = ({ children }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.2 });

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={sectionVariants}
      >
        {children}
      </motion.div>
    );
  };

  // Load Google Maps script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/erranderdashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(response.data?.profile || {});
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('An error occurred while fetching profile data', {
          style: { background: '#F44', color: 'white' },
        });
        if (error.response?.status === 401 || error.response?.status === 404) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  // Fetch bookings and notifications, and set up Socket.IO
  useEffect(() => {
    if (profile?.userId?._id) {
      // Join Socket.IO room
      socket.emit('join', profile.userId._id);

      // Fetch bookings (errands) for this errander
      const fetchBookings = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/errand/history`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const erranderBookings = response.data.history.filter(
            (booking) => booking.erranderId._id === profile.userId._id
          );
          setBookings(erranderBookings);
          setHistory(erranderBookings);
        } catch (error) {
          console.error('Error fetching bookings:', error);
          toast.error('Error fetching bookings', {
            style: { background: 'white', color: 'red' },
          });
        } finally {
          setLoading(false);
        }
      };

      // Fetch notifications
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/errand/notifications`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setNotifications(response.data.notifications);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchBookings();
      fetchNotifications();
    }
  }, [profile]);

  // Socket.IO listeners
  useEffect(() => {
    socket.on('newErrand', (errand) => {
      if (errand.erranderId === profile.userId._id) {
        setBookings((prev) => [...prev, errand]);
        setHistory((prev) => [...prev, errand]);
        toast.info('You have a new booking request!');
      }
    });

    socket.on('errandUpdate', (errand) => {
      if (errand.erranderId === profile.userId._id) {
        setBookings((prev) =>
          prev.map((e) => (e._id === errand._id ? errand : e))
        );
        setHistory((prev) =>
          prev.map((e) => (e._id === errand._id ? errand : e))
        );
        if (errand.status === 'in_progress') {
          setTrackingErrand(errand);
        }
        toast.info(`Booking status updated: ${errand.status}`);
      }
    });

    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.info(notification.message);
    });

    socket.on('erranderLocation', ({ errandId, position }) => {
      if (trackingErrand && trackingErrand._id === errandId) {
        setErranderPosition(position);
      }
    });

    return () => {
      socket.off('newErrand');
      socket.off('errandUpdate');
      socket.off('notification');
      socket.off('erranderLocation');
    };
  }, [trackingErrand, profile]);

  // Handle accepting an errand
  const handleAcceptErrand = async (errandId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/errand/${errandId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (response.data.status) {
        toast.success('Booking accepted!', {
          style: { background: 'white', color: 'black' },
        });
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast.error('Failed to accept booking', {
        style: { background: 'white', color: 'red' },
      });
    }
  };

  // Handle rejecting an errand
  const handleRejectErrand = async (errandId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/errand/${errandId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (response.data.status) {
        toast.success('Booking rejected!', {
          style: { background: 'white', color: 'black' },
        });
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Failed to reject booking', {
        style: { background: 'white', color: 'red' },
      });
    }
  };

  // Handle starting an errand
  const handleStartErrand = async (errandId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/errand/${errandId}/start`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (response.data.status) {
        toast.success('Booking started!', {
          style: { background: 'white', color: 'black' },
        });
      }
    } catch (error) {
      console.error('Error starting booking:', error);
      toast.error('Failed to start booking', {
        style: { background: 'white', color: 'red' },
      });
    }
  };

  // Handle completing an errand
  const handleCompleteErrand = async (errandId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/errand/${errandId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (response.data.status) {
        toast.success('Booking completed!', {
          style: { background: 'white', color: 'black' },
        });
      }
    } catch (error) {
      console.error('Error completing booking:', error);
      toast.error('Failed to complete booking', {
        style: { background: 'white', color: 'red' },
      });
    }
  };

  // Filter bookings based on the active tab
  const filteredBookings = history.filter((booking) => {
    if (activeTab === 'pending') return booking.status === 'pending';
    if (activeTab === 'accepted') return booking.status === 'accepted' || booking.status === 'in_progress' || booking.status === 'completed';
    if (activeTab === 'rejected') return booking.status === 'rejected';
    return false;
  });

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100 font-sans">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg lg:w-1/5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-900 rounded-md mr-2"></div>
              <h1 className="text-xl font-bold text-gray-800">E_Errands</h1>
            </div>
            <nav>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/erranderdashboard"
                    className={`flex items-center ${
                      location.pathname === '/erranderdashboard' ? 'text-gray-800 font-semibold' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FaChartBar className="mr-3 text-gray-500" /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="flex items-center text-gray-600 hover:text-gray-800"
                  >
                    <FaChartBar className="mr-3 text-gray-500" /> MyErranders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/userprofile"
                    className={`flex items-center ${
                      location.pathname === '/userprofile' ? 'text-gray-800 font-semibold' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FaHotel className="mr-3 text-gray-500" /> Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="flex items-center text-gray-600 hover:text-gray-800"
                  >
                    <FaCar className="mr-3 text-gray-500" /> Reports
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="flex items-center text-gray-600 hover:text-gray-800"
                  >
                    <FaPlane className="mr-3 text-gray-500" /> Statistics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="flex items-center text-red-600 hover:text-gray-800"
                  >
                    <FaUser className="mr-3 text-red-500" /> Logout
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center">
            <img
              src={profile.profilePicture || 'https://randomuser.me/api/portraits/women/44.jpg'}
              alt="User"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="text-green-800">{profile?.userId?.email}</p>
              <p className="text-gray-800 font-semibold">{profile?.userId?.firstName} {profile?.userId?.lastName}</p>
              <Link to="#" className="text-gray-600 text-sm hover:underline">
                Visit site
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4 text-gray-600"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <FaBars size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">Errander Dashboard</h2>
            </div>
          </div>

          <div className="ml-64 lg:ml-[20%] p-6 rounded-xl max-w-7xl mx-auto">
            {/* Notifications Section */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Notifications</h3>
              {notifications.length > 0 ? (
                <ul className="space-y-2">
                  {notifications.map((notification) => (
                    <li
                      key={notification._id}
                      className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                    >
                      <span>{notification.message}</span>
                      <span className="text-gray-500 text-sm">{new Date(notification.createdAt).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No notifications available.</p>
              )}
            </div>

            {/* Errander Profile Section */}
            {/* <AnimatedSection>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center mt-2">
                    <img
                      src={profile.profilePicture || 'https://via.placeholder.com/50'}
                      alt={`${profile.userId?.firstName}'s profile`}
                      className="w-12 h-12 rounded-full mr-2"
                    />
                  </div>
                  <p className="text-gray-800 font-semibold">
                    Name:{' '}
                    <span className="font-normal">
                      {profile.userId?.firstName || 'James'} {profile.userId?.lastName || 'Johnson'}
                    </span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Age: <span className="font-normal">{profile.age || 'N/A'}</span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Gender: <span className="font-normal">{profile.gender || 'N/A'}</span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Location:{' '}
                    <span className="font-normal">
                      {profile.LGA || profile.userId?.lga || 'Unknown'}, {profile.state || 'Unknown'}
                    </span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Vehicle: <span className="font-normal">{profile.WDYD || 'Unknown'}</span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Email: <span className="font-normal">{profile.userId?.email || 'N/A'}</span>
                  </p>
                </div>
              </div>
            </AnimatedSection> */}

            {/* Errand History (Chats) Section */}
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">My Bookings</h3>
              <div className="flex space-x-4 mb-4">
                <button
                  className={`px-4 py-2 rounded-md ${activeTab === 'pending' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setActiveTab('pending')}
                >
                  Pending
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${activeTab === 'accepted' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setActiveTab('accepted')}
                >
                  Accepted
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${activeTab === 'rejected' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setActiveTab('rejected')}
                >
                  Rejected
                </button>
              </div>
              {filteredBookings.length > 0 ? (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                    >
                      <div>
                        <p className="text-gray-800 font-semibold">
                          Client : <span className="font-normal">{booking.clientId?.firstName}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Pickup: <span className="font-normal">{booking.pickupAddress}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Destination: <span className="font-normal">{booking.destinationAddress}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Package: <span className="font-normal">{booking.packageDescription}</span>
                        </p>
                      

                              <div className="flex items-center mt-2">
                                                      <img
                                                        src={booking.packagePicture || 'https://via.placeholder.com/50'}
                                                        alt={`${booking.clientId?.firstName}'s profile`}
                                                        className="w-12 h-12 rounded-full mr-2"
                                                      />
                                                      <button
                                                        onClick={() => window.open(booking.packagePicture || 'https://via.placeholder.com/50', '_blank')}
                                                      >
                                                        <FaEye className="inline mr-1" /> View Picture
                                                      </button>
                                                    </div>
                            
                   
                        <p className="text-gray-800 font-semibold">
                          Price: <span className="font-normal">₦{booking.calculatedPrice}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Payment Method: <span className="font-normal">{booking.paymentMethod}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Status: <span className="font-normal">{booking.status}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Created: <span className="font-normal">{new Date(booking.createdAt).toLocaleString()}</span>
                        </p>
                        {/* Errander actions */}
                        {booking.erranderId === profile.userId._id && (
                          <div className="flex gap-2 mt-2">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                                  onClick={() => handleAcceptErrand(booking._id)}
                                >
                                  Accept
                                </button>
                                <button
                                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                                  onClick={() => handleRejectErrand(booking._id)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {booking.status === 'accepted' && (
                              <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                                onClick={() => handleStartErrand(booking._id)}
                              >
                                Start Booking
                              </button>
                            )}
                            {booking.status === 'in_progress' && (
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                                onClick={() => handleCompleteErrand(booking._id)}
                              >
                                Complete Booking
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      {/* Tracking for in_progress bookings */}
                      {booking.status === 'in_progress' && (
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                          onClick={() => setTrackingErrand(booking)}
                        >
                          Track Booking
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No bookings available for this status.</p>
              )}
            </div>

            {/* Tracking Modal */}
            {trackingErrand && isLoaded && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Tracking Booking</h3>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '400px' }}
                    center={erranderPosition || { lat: 6.5244, lng: 3.3792 }}
                    zoom={10}
                  >
                    {erranderPosition && <Marker position={erranderPosition} />}
                  </GoogleMap>
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                      onClick={() => setTrackingErrand(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MyErrander;