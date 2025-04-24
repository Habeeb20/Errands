import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaChartBar, FaHotel, FaCar, FaPlane, FaUser } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FaShareAlt, FaBox, FaThumbsUp, FaThumbsDown, FaEye } from 'react-icons/fa';
import { FaMotorcycle, FaBus, FaBicycle } from 'react-icons/fa';
import DistanceBadge from '../../components/DistanceBadge';
import io from 'socket.io-client';
import { GoogleMap, Marker, useLoadScript, Autocomplete } from '@react-google-maps/api';

// Initialize Socket.IO client
const socket = io(import.meta.env.VITE_BACKEND_URL);

function ErrandersInDashboard() {
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

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareCounts, setShareCounts] = useState({});
  const [clickCounts, setClickCounts] = useState({});
  const [clicks, setClicks] = useState([]);
  const [comments, setComments] = useState([]);
  const [expandedErrander, setExpandedErrander] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedErrander, setSelectedErrander] = useState(null);
  const [distanceData, setDistanceData] = useState({ distance: null, fare: null });
  const [bookingDetails, setBookingDetails] = useState({
    pickupAddress: '',
    destinationAddress: '',
    packageDescription: '',
    packagePicture: '',
    paymentMethod: 'cash',
  });
  const [history, setHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [trackingErrand, setTrackingErrand] = useState(null);
  const [erranderPosition, setErranderPosition] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false); // Loading state for Confirm Booking
  const [isContinuing, setIsContinuing] = useState(false); // Loading state for Continue

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const detailsVariants = {
    hidden: { height: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
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

  // Load Google Maps script with Places library
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'], // Required for Autocomplete
  });

  // References for Autocomplete inputs
  const pickupAutocompleteRef = useRef(null);
  const destinationAutocompleteRef = useRef(null);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return bookingDetails.packagePicture;

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'essential');
    formData.append('cloud_name', 'dc0poqt9l');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dc0poqt9l/image/upload',
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      toast.error('Failed to upload profile picture', {
        style: { background: '#F44', color: 'white' },
      });
      return bookingDetails.packagePicture;
    }
  };

  // Fetch all erranders
  useEffect(() => {
    const fetchAllErranders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/erranders`);
        toast.success('Erranders are available', {
          style: { background: 'white', color: 'black' },
        });
        setData(response.data.data || []);

        const initialShareCounts = {};
        const initialClickCounts = {};
        response.data.data.forEach((errander) => {
          initialShareCounts[errander.slug] = 0;
          initialClickCounts[errander.slug] = 0;
        });
        setShareCounts(initialShareCounts);
        setClickCounts(initialClickCounts);
      } catch (error) {
        console.log('Error fetching erranders:', error);
        toast.error('Error occurred while fetching erranders', {
          style: { background: 'white', color: 'black' },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAllErranders();
  }, []);

  // Fetch shares for each errander
  useEffect(() => {
    const fetchShares = async (slug) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/profile/${slug}/shares`);
        setShareCounts((prev) => ({
          ...prev,
          [slug]: response.data.shareCount || 0,
        }));
      } catch (error) {
        console.log(`Failed to fetch shares for ${slug}:`, error);
        toast.error(`Failed to fetch shares for ${slug}`, {
          style: { background: 'white', color: 'red' },
        });
      }
    };

    data.forEach((errander) => {
      if (errander.slug) fetchShares(errander.slug);
    });
  }, [data]);

  // Fetch clicks for each errander
  useEffect(() => {
    const fetchClicks = async (slug) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/profile/get-clicks/${slug}`);
        setClickCounts((prev) => ({
          ...prev,
          [slug]: response.data.clicks || 0,
        }));
        setClicks(response.data.clicks);
      } catch (error) {
        console.log(`Failed to fetch clicks for ${slug}:`, error);
        toast.error(`Failed to fetch clicks for ${slug}`, {
          style: { background: 'white', color: 'red' },
        });
      }
    };

    data.forEach((errander) => {
      if (errander.slug) fetchClicks(errander.slug);
    });
  }, [data]);

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

  // Fetch history and notifications, and set up Socket.IO
  useEffect(() => {
    if (profile?.userId?._id) {
      // Join Socket.IO room
      socket.emit('join', profile.userId._id);

      // Fetch history
      const fetchHistory = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/errand/history`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setHistory(response.data.history);
          console.log(response.data.history, "historyv")
        } catch (error) {
          console.error('Error fetching history:', error);
        }
      };

      // Fetch notifications
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/errand/notifications`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setNotifications(response.data.notifications);
          console.log(response.data.notifications, "notifications")
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchHistory();
      fetchNotifications();
    }
  }, [profile]);

  // Socket.IO listeners
  useEffect(() => {
    socket.on('newErrand', (errand) => {
      setHistory((prev) => [...prev, errand]);
      toast.info('You have a new errand request!');
    });

    socket.on('errandUpdate', (errand) => {
      setHistory((prev) =>
        prev.map((e) => (e._id === errand._id ? errand : e))
      );
      if (errand.status === 'in_progress') {
        setTrackingErrand(errand);
      }
      toast.info(`Errand status updated: ${errand.status}`);
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
  }, [trackingErrand]);

  // Handle share click
  const handleShareClick = async (slug) => {
    try {
      setShareCounts((prev) => ({
        ...prev,
        [slug]: prev[slug] + 1,
      }));

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/profile/${slug}/shares`);
      if (response.data && response.data.shareCount) {
        setShareCounts((prev) => ({
          ...prev,
          [slug]: response.data.shareCount,
        }));
      }
    } catch (error) {
      console.error(`Failed to record share for ${slug}:`, error);
      setShareCounts((prev) => ({
        ...prev,
        [slug]: prév[slug] - 1,
      }));
      toast.error('Failed to record share. Please try again.', {
        style: { background: 'red', color: 'white' },
      });
    }
  };

  // Handle book click
  const handleBookClick = async (errander) => {
    setSelectedErrander(errander);
    setShowBookingForm(true); // Open the booking form first to allow address input
  };

  // Handle continue in the booking form
  const handleContinue = async () => {
    if (!bookingDetails.pickupAddress || !bookingDetails.destinationAddress) {
      toast.error('Please provide both pickup and destination addresses', {
        style: { background: 'white', color: 'red' },
      });
      return;
    }

    setIsContinuing(true); // Start loading
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token missing. Please log in again.', {
        style: { background: 'white', color: 'red' },
      });
      navigate('/login');
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/errand/calculate-fare`, {
        pickupAddress: bookingDetails.pickupAddress,
        destinationAddress: bookingDetails.destinationAddress,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

      if (response.data.status) {
        setDistanceData({
          distance: response.data.data?.distance,
          fare: response.data.data?.fare,
        });
        setShowBookingForm(false);
        setShowModal(true);
      } else {
        toast.error('Failed to calculate fare', {
          style: { background: 'white', color: 'red' },
        });
      }
    } catch (error) {
      console.error('Error calculating fare:', error);
      toast.error('Error calculating fare', {
        style: { background: 'white', color: 'red' },
      });
    } finally {
      setIsContinuing(false); // Stop loading
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsConfirming(true); // Start loading

    try {
      if (!selectedErrander || !selectedErrander._id) {
        toast.error('Please select an errander', {
          style: { background: 'white', color: 'red' },
        });
        return;
      }

      if (!bookingDetails.pickupAddress || !bookingDetails.destinationAddress || !bookingDetails.packageDescription) {
        toast.error('Please fill in all required fields', {
          style: { background: 'white', color: 'red' },
        });
        return;
      }

      if (!distanceData.distance || !distanceData.fare) {
        toast.error('Distance and fare must be calculated', {
          style: { background: 'white', color: 'red' },
        });
        return;
      }

      const parsedDistance = parseFloat(distanceData.distance);
      const parsedFare = parseFloat(distanceData.fare);
      if (isNaN(parsedDistance) || isNaN(parsedFare)) {
        toast.error('Invalid distance or fare value', {
          style: { background: 'white', color: 'red' },
        });
        return;
      }

      const packagePictureUrl = await uploadImageToCloudinary();

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/errand/create`,
        {
          erranderProfileId: selectedErrander._id,
          pickupAddress: bookingDetails.pickupAddress,
          destinationAddress: bookingDetails.destinationAddress,
          packageDescription: bookingDetails.packageDescription,
          packagePicture: packagePictureUrl || '',
          distance: parsedDistance,
          calculatedPrice: parsedFare,
          paymentMethod: bookingDetails.paymentMethod.toLowerCase(),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (response.data.status) {
        setShowModal(false);
        setBookingDetails({
          pickupAddress: '',
          destinationAddress: '',
          packageDescription: '',
          packagePicture: '',
          paymentMethod: 'cash',
        });
        setImageFile(null);
        setDistanceData({ distance: null, fare: null });
        toast.success('Errand booked successfully!', {
          style: { background: 'white', color: 'black' },
        });
      }
    } catch (error) {
      console.error('Error booking errand:', error);
      const errorMessage = error.response?.data?.message || 'Failed to book errand';
      toast.error(errorMessage, {
        style: { background: 'white', color: 'red' },
      });
    } finally {
      setIsConfirming(false); // Stop loading
    }
  };

  // Handle cancelling an errand
  const handleCancelErrand = async (errandId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/errand/${errandId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (response.data.status) {
        toast.success('Errand cancelled!', {
          style: { background: 'white', color: 'black' },
        });
      }
    } catch (error) {
      console.error('Error cancelling errand:', error);
      toast.error('Failed to cancel errand', {
        style: { background: 'white', color: 'red' },
      });
    }
  };

  // Handle accepting an errand (for errander)
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
        toast.success('Errand accepted!', {
          style: { background: 'white', color: 'black' },
        });
      }
    } catch (error) {
      console.error('Error accepting errand:', error);
      toast.error('Failed to accept errand', {
        style: { background: 'white', color: 'red' },
      });
    }
  };

  // Handle rejecting an errand (for errander)
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
        toast.success('Errand rejected!', {
          style: { background: 'white', color: 'black' },
        });
      }
    } catch (error) {
      console.error('Error rejecting errand:', error);
      toast.error('Failed to reject errand', {
        style: { background: 'white', color: 'red' },
      });
    }
  };

  // Handle starting an errand (for errander)
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
        toast.success('Errand started!', {
          style: { background: 'white', color: 'black' },
        });
      }
    } catch (error) {
      console.error('Error starting errand:', error);
      toast.error('Failed to start errand', {
        style: { background: 'white', color: 'red' },
      });
    }
  };

  // Handle completing an errand (for errander)
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
        toast.success('Errand completed!', {
          style: { background: 'white', color: 'black' },
        });
      }
    } catch (error) {
      console.error('Error completing errand:', error);
      toast.error('Failed to complete errand', {
        style: { background: 'white', color: 'red' },
      });
    }
  };

  // Handle Autocomplete place selection
  const handlePlaceChanged = (type) => {
    const autocomplete = type === 'pickup' ? pickupAutocompleteRef.current : destinationAutocompleteRef.current;
    const place = autocomplete.getPlace();
    if (place && place.formatted_address) {
      setBookingDetails((prev) => ({
        ...prev,
        [type === 'pickup' ? 'pickupAddress' : 'destinationAddress']: place.formatted_address,
      }));
    }
  };

  // Handle view more click
  const handleViewMoreClick = (slug) => {
    setExpandedErrander(expandedErrander === slug ? null : slug);
  };

  return (
    <>
      <style>
        {`
          .spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #ffffff;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-left: 8px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
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
                    to="/userdashboard"
                    className={`flex items-center ${
                      location.pathname === '/userdashboard' ? 'text-gray-800 font-semibold' : 'text-gray-600 hover:text-gray-800'
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
                    <FaChartBar className="mr-3 text-gray-500" /> Erranders
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
              <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
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
                      <span>{notification.message} <span className='space-x-5 font-semibold text-green-500'>({notification.erranderId?.firstName} {notification.erranderId?.lastName} {notification.erranderId?.email})</span></span>
                      <span className="text-gray-500 text-sm">{new Date(notification.createdAt).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No notifications available.</p>
              )}
            </div>

            {/* Available Erranders Section */}
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Erranders</h2>
              {data && data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.map((dat, index) => (
                    <div
                      key={dat._id || index}
                      className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center mt-2">
                          <img
                            src={dat.profilePicture || 'https://via.placeholder.com/50'}
                            alt={`${dat.userId?.firstName}'s profile`}
                            className="w-12 h-12 rounded-full mr-2"
                          />
                          <button
                            onClick={() => window.open(dat.profilePicture || 'https://via.placeholder.com/50', '_blank')}
                          >
                            <FaEye className="inline mr-1" /> View Picture
                          </button>
                        </div>
                        <p className="text-gray-800 font-semibold">
                          Name:{' '}
                          <span className="font-normal">
                            {dat.userId?.firstName || 'James'} {dat.userId?.lastName || 'Johnson'}
                          </span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Age: <span className="font-normal">{dat.age || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Gender: <span className="font-normal">{dat.gender || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Location:{' '}
                          <span className="font-normal">
                            {dat.LGA || dat.userId?.lga || 'Unknown'}, {dat.state || 'Unknown'}
                          </span>
                        </p>
                        <p className="text-gray-800 font-semibold flex items-center">
                          Vehicle:{' '}
                          <span className="font-normal flex items-center ml-1">
                            {dat.WDYD ? (
                              <>
                                {dat.WDYD.toLowerCase() === 'bike' && <FaMotorcycle className="mr-1 text-gray-600" />}
                                {dat.WDYD.toLowerCase() === 'bus' && <FaBus className="mr-1 text-gray-600" />}
                                {dat.WDYD.toLowerCase() === 'car' && <FaCar className="mr-1 text-gray-600" />}
                                {dat.WDYD.toLowerCase() === 'bicycle' && <FaBicycle className="mr-1 text-gray-600" />}
                                {dat.WDYD}
                              </>
                            ) : (
                              'Unknown'
                            )}
                          </span>
                        </p>
                        <p
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            dat.userId?.verificationStatus === 'verified'
                              ? 'text-green-800 bg-green-200'
                              : dat.userId?.verificationStatus === 'unverified'
                              ? 'text-red-800 bg-red-200'
                              : 'text-yellow-800 bg-yellow-200'
                          }`}
                        >
                          Verification Status:{' '}
                          <span className="font-normal">{dat.userId?.verificationStatus || 'Pending'}</span>
                        </p>
                        <button
                          className="bg-green-400 p-2 rounded-md text-white ml-3"
                          onClick={() => handleBookClick(dat)}
                        >
                          Book
                        </button>
                      </div>

                      <motion.div
                        initial="hidden"
                        animate={expandedErrander === dat.slug ? 'visible' : 'hidden'}
                        variants={detailsVariants}
                        className="overflow-hidden space-y-2"
                      >
                        <p className="text-gray-800 font-semibold">
                          Marital Status: <span className="font-normal">{dat.maritalStatus || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Email: <span className="font-normal">{dat.userId?.email || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Phone: <span className="font-normal">{dat.referenceContact || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Driver's License: <span className="font-normal">{dat.driverLicense || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          National Identification Number (NIN):{' '}
                          <span className="font-normal">{dat.NIN || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Medical Condition: <span className="font-normal">{dat.medicalCondition || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Alcohol Use: <span className="font-normal">{dat.alcoholUse || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Height: <span className="font-normal">{dat.height || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Weight: <span className="font-normal">{dat.weight || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Reference Address: <span className="font-normal">{dat.referenceAddress || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Reference Occupation:{' '}
                          <span className="font-normal">{dat.referenceOccupation || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Number of Wives: <span className="font-normal">{dat.numberOfWives || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Address of Spouse: <span className="font-normal">{dat.addressOfSpouse || 'N/A'}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Number of Children:{' '}
                          <span className="font-normal">{dat.numberOfChildren || 'N/A'}</span>
                        </p>
                      </motion.div>

                      <div className="flex flex-wrap gap-4">
                        <DistanceBadge dat={{ LGA: dat.userId?.lga || dat.lga || dat.LGA || 'Ikeja, Lagos' }} />
                        <Link to="">
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                            onClick={async (e) => {
                              if (!expandedErrander) {
                                e.preventDefault();
                              }
                              handleViewMoreClick(dat.slug);
                              try {
                                await axios.post(
                                  `${import.meta.env.VITE_BACKEND_URL}/api/profile/${dat.slug}/click`
                                );
                                setClickCounts((prev) => ({
                                  ...prev,
                                  [dat.slug]: prev[dat.slug] + 1,
                                }));
                                toast.success('Click counted', {
                                  style: { background: 'white', color: 'black' },
                                });
                              } catch (error) {
                                console.error('Error incrementing click count:', error);
                                toast.error('Failed to record click', {
                                  style: { background: 'white', color: 'red' },
                                });
                              }
                            }}
                          >
                            {expandedErrander === dat.slug ? 'View Less' : 'View More'}
                          </button>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4">
                          <div className="flex items-center text-gray-600">
                            <FaBox className="mr-1 text-gray-500" />
                            <span>{dat.commentCount}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaThumbsUp className="mr-1 text-green-500" />
                            <span>{clickCounts[dat.slug] || 0}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaThumbsDown className="mr-1 text-red-500" />
                            <span>{dat.negative || 0}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleShareClick(dat.slug)}
                          className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                          <FaShareAlt className="mr-1" />
                          <span>{shareCounts[dat.slug] || 0}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No erranders available at the moment.</p>
              )}
            </AnimatedSection>

            {/* History Section */}
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Errand History</h3>
              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((errand) => (
                    <div
                      key={errand._id}
                      className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                    >
                      <div>
                      <div className="flex items-center mt-2">
                          <img
                            src={errand.errander?.profilePicture || 'https://via.placeholder.com/50'}
                            alt={`${errand.erranderId?.firstName}'s profile`}
                            className="w-12 h-12 rounded-full mr-2"
                          />
                          <button
                            onClick={() => window.open(errand.errander?.profilePicture || 'https://via.placeholder.com/50', '_blank')}
                          >
                            <FaEye className="inline mr-1" /> View Picture
                          </button>
                        </div>
                      <p className="text-gray-800 font-semibold">
                          Errander Name: <span className="font-normal">{errand.erranderId?.firstName} {errand.clientId?.lastName}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Errander phone-Number: <span className="font-normal">{errand.erranderId?.phone} </span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Errander email: <span className="font-normal">{errand.erranderId?.email} </span>
                        </p>
                        <p className="text-green-800 font-semibold">
                          Errander unique-Number: <span className="font-normal">{errand.erranderId?.uniqueNumber} </span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Pickup: <span className="font-normal">{errand.pickupAddress}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Destination: <span className="font-normal">{errand.destinationAddress}</span>
                        </p>
                        <p className={`{text-gray-800 font-semibold ${errand.status === "accepted" ? "text-green-500 font-semibold" : "text-yellow=400"}}`}>
                          Status: <span className="font-normal">{errand.status}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Price: <span className="font-normal">₦{errand.calculatedPrice}</span>
                        </p>
                        {/* Client actions */}
                        {errand.clientId === profile.userId._id && errand.status === 'pending' && (
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition mt-2"
                            onClick={() => handleCancelErrand(errand._id)}
                          >
                            Cancel Errand
                          </button>
                        )}
                        {/* Errander actions */}
                        {errand.erranderId === profile.userId._id && (
                          <div className="flex gap-2 mt-2">
                            {errand.status === 'pending' && (
                              <>
                                <button
                                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                                  onClick={() => handleAcceptErrand(errand._id)}
                                >
                                  Accept
                                </button>
                                <button
                                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                                  onClick={() => handleRejectErrand(errand._id)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {errand.status === 'accepted' && (
                              <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                                onClick={() => handleStartErrand(errand._id)}
                              >
                                Start Errand
                              </button>
                            )}
                            {errand.status === 'in_progress' && (
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                                onClick={() => handleCompleteErrand(errand._id)}
                              >
                                Complete Errand
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      {/* Client tracking */}
                      {errand.clientId === profile.userId._id && errand.status === 'in_progress' && (
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                          onClick={() => setTrackingErrand(errand)}
                        >
                          Track Errand
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No errand history available.</p>
              )}
            </div>

            {/* Tracking Modal */}
            {trackingErrand && isLoaded && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Tracking Errand</h3>
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

        {/* Modal for Google Map */}
        {showModal && selectedErrander && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
              <h3>The distance between your pickup and destination addresses</h3>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Route from {bookingDetails.pickupAddress} to {bookingDetails.destinationAddress}
              </h4>
              <div className="w-full h-64 mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/directions?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(
                    bookingDetails.pickupAddress
                  )}&destination=${encodeURIComponent(
                    bookingDetails.destinationAddress
                  )}&mode=driving`}
                  allowFullScreen
                ></iframe>
              </div>
              {distanceData.distance && distanceData.fare ? (
                <div className="mb-4">
                  <p className="text-gray-800 font-semibold">
                    Distance: <span className="font-normal">{distanceData.distance} km</span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Fare: <span className="text-green-500 font-bold">₦{distanceData.fare}</span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 mb-4">Calculating distance and fare...</p>
              )}
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                  onClick={() => {
                    setShowModal(false);
                    setShowBookingForm(true);
                  }}
                >
                  Back
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition flex items-center"
                  onClick={handleBookingSubmit}
                  disabled={isConfirming}
                >
                  Confirm Booking
                  {isConfirming && <span className="spinner"></span>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && selectedErrander && isLoaded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Complete Your Booking</h3>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                  <label className="block text-gray-800 font-semibold mb-2">Pickup Address</label>
                  <Autocomplete
                    onLoad={(autocomplete) => (pickupAutocompleteRef.current = autocomplete)}
                    onPlaceChanged={() => handlePlaceChanged('pickup')}
                  >
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter pickup address"
                      value={bookingDetails.pickupAddress}
                      onChange={(e) =>
                        setBookingDetails({ ...bookingDetails, pickupAddress: e.target.value })
                      }
                      required
                    />
                  </Autocomplete>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-800 font-semibold mb-2">Destination Address</label>
                  <Autocomplete
                    onLoad={(autocomplete) => (destinationAutocompleteRef.current = autocomplete)}
                    onPlaceChanged={() => handlePlaceChanged('destination')}
                  >
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter destination address"
                      value={bookingDetails.destinationAddress}
                      onChange={(e) =>
                        setBookingDetails({ ...bookingDetails, destinationAddress: e.target.value })
                      }
                      required
                    />
                  </Autocomplete>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-800 font-semibold mb-2">Package Description</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    value={bookingDetails.packageDescription}
                    onChange={(e) =>
                      setBookingDetails({ ...bookingDetails, packageDescription: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-800 font-semibold mb-2">Package Picture (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-800 font-semibold mb-2">Payment Method</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={bookingDetails.paymentMethod}
                    onChange={(e) =>
                      setBookingDetails({ ...bookingDetails, paymentMethod: e.target.value })
                    }
                  >
                    <option value="cash">Cash</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                    onClick={() => setShowBookingForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition flex items-center"
                    onClick={handleContinue}
                    disabled={isContinuing}
                  >
                    Continue
                    {isContinuing && <span className="spinner"></span>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ErrandersInDashboard;