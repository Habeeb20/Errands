// import { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { FaBars, FaChartBar, FaHotel, FaCar, FaPlane, FaUser, FaEye, FaTimes } from 'react-icons/fa';
// import Navbar from '../../components/Navbar';
// import { Link } from 'react-router-dom';
// import { motion, useInView } from 'framer-motion';
// import io from 'socket.io-client';
// import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

// // Initialize Socket.IO client
// const socket = io(import.meta.env.VITE_BACKEND_URL);

// function MyErrander() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [profile, setProfile] = useState({
//     userEmail: '',
//     age: '',
//     gender: '',
//     dateOfBirth: '',
//     state: '',
//     LGA: '',
//     address: '',
//     maritalStatus: '',
//     WDYD: '',
//     profilePicture: '',
//     driverLicense: '',
//     NIN: '',
//     medicalCondition: '',
//     alcoholUse: '',
//     height: '',
//     weight: '',
//     referenceAddress: '',
//     referenceContact: '',
//     referenceOccupation: '',
//     numberOfWives: '',
//     addressOfSpouse: '',
//     numberOfChildren: '',
//   });

//   const navigate = useNavigate();
//   const location = useLocation();

//   const [bookings, setBookings] = useState([]); // Store all bookings for the errander
//   const [loading, setLoading] = useState(true);
//   const [history, setHistory] = useState([]); // Store errand history
//   const [notifications, setNotifications] = useState([]);
//   const [trackingErrand, setTrackingErrand] = useState(null);
//   const [erranderPosition, setErranderPosition] = useState(null);
//   const [activeTab, setActiveTab] = useState('pending'); // For tabbed history view

//   const sectionVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
//   };

//   const AnimatedSection = ({ children }) => {
//     const ref = useRef(null);
//     const isInView = useInView(ref, { once: true, threshold: 0.2 });

//     return (
//       <motion.div
//         ref={ref}
//         initial="hidden"
//         animate={isInView ? 'visible' : 'hidden'}
//         variants={sectionVariants}
//       >
//         {children}
//       </motion.div>
//     );
//   };

//   // Load Google Maps script
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//   });

//   // Fetch user profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/auth/erranderdashboard`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setProfile(response.data?.profile || {});
//       } catch (error) {
//         console.error('Error fetching profile data:', error);
//         toast.error('An error occurred while fetching profile data', {
//           style: { background: '#F44', color: 'white' },
//         });
//         if (error.response?.status === 401 || error.response?.status === 404) {
//           localStorage.removeItem('token');
//           navigate('/login');
//         }
//       }
//     };

//     fetchProfile();
//   }, [navigate]);

//   // Fetch bookings and notifications, and set up Socket.IO
//   useEffect(() => {
//     if (profile?.userId?._id) {
//       // Join Socket.IO room
//       socket.emit('join', profile.userId._id);

//       // Fetch bookings (errands) for this errander
//       const fetchBookings = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/errand/history`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//           });
//           const erranderBookings = response.data.history.filter(
//             (booking) => booking.erranderId._id === profile.userId._id
//           );
//           setBookings(erranderBookings);
//           setHistory(erranderBookings);
//         } catch (error) {
//           console.error('Error fetching bookings:', error);
//           toast.error('Error fetching bookings', {
//             style: { background: 'white', color: 'red' },
//           });
//         } finally {
//           setLoading(false);
//         }
//       };

//       // Fetch notifications
//       const fetchNotifications = async () => {
//         try {
//           const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/errand/notifications`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//           });
//           setNotifications(response.data.notifications);
//         } catch (error) {
//           console.error('Error fetching notifications:', error);
//         }
//       };

//       fetchBookings();
//       fetchNotifications();
//     }
//   }, [profile]);

//   // Socket.IO listeners
//   useEffect(() => {
//     socket.on('newErrand', (errand) => {
//       if (errand.erranderId === profile.userId._id) {
//         setBookings((prev) => [...prev, errand]);
//         setHistory((prev) => [...prev, errand]);
//         toast.info('You have a new booking request!');
//       }
//     });

//     socket.on('errandUpdate', (errand) => {
//       if (errand.erranderId === profile.userId._id) {
//         setBookings((prev) =>
//           prev.map((e) => (e._id === errand._id ? errand : e))
//         );
//         setHistory((prev) =>
//           prev.map((e) => (e._id === errand._id ? errand : e))
//         );
//         if (errand.status === 'in_progress') {
//           setTrackingErrand(errand);
//         }
//         toast.info(`Booking status updated: ${errand.status}`);
//       }
//     });

//     socket.on('notification', (notification) => {
//       setNotifications((prev) => [notification, ...prev]);
//       toast.info(notification.message);
//     });

//     socket.on('erranderLocation', ({ errandId, position }) => {
//       if (trackingErrand && trackingErrand._id === errandId) {
//         setErranderPosition(position);
//       }
//     });

//     return () => {
//       socket.off('newErrand');
//       socket.off('errandUpdate');
//       socket.off('notification');
//       socket.off('erranderLocation');
//     };
//   }, [trackingErrand, profile]);

//   // Real-time location tracking for in_progress errands
//   useEffect(() => {
//     let watchId;
//     if (trackingErrand && trackingErrand.status === 'in_progress') {
//       if (navigator.geolocation) {
//         watchId = navigator.geolocation.watchPosition(
//           (position) => {
//             const newPosition = {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude,
//             };
//             setErranderPosition(newPosition);
//             // Emit the location to the backend
//             socket.emit('updateLocation', {
//               userId: profile.userId._id,
//               errandId: trackingErrand._id,
//               position: newPosition,
//             });
//           },
//           (error) => {
//             console.error('Geolocation error:', error);
//             toast.error('Failed to get your location', {
//               style: { background: 'white', color: 'red' },
//             });
//           },
//           {
//             enableHighAccuracy: true,
//             timeout: 5000,
//             maximumAge: 0,
//           }
//         );
//       } else {
//         toast.error('Geolocation is not supported by your browser', {
//           style: { background: 'white', color: 'red' },
//         });
//       }
//     }

//     // Cleanup on unmount or when tracking stops
//     return () => {
//       if (watchId) {
//         navigator.geolocation.clearWatch(watchId);
//       }
//     };
//   }, [trackingErrand, profile]);

//   // Handle accepting an errand
//   const handleAcceptErrand = async (errandId) => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/errand/${errandId}/accept`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }
//       );
//       if (response.data.status) {
//         toast.success('Booking accepted!', {
//           style: { background: 'white', color: 'black' },
//         });
//       }
//     } catch (error) {
//       console.error('Error accepting booking:', error);
//       toast.error('Failed to accept booking', {
//         style: { background: 'white', color: 'red' },
//       });
//     }
//   };

//   // Handle rejecting an errand
//   const handleRejectErrand = async (errandId) => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/errand/${errandId}/reject`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }
//       );
//       if (response.data.status) {
//         toast.success('Booking rejected!', {
//           style: { background: 'white', color: 'black' },
//         });
//       }
//     } catch (error) {
//       console.error('Error rejecting booking:', error);
//       toast.error('Failed to reject booking', {
//         style: { background: 'white', color: 'red' },
//       });
//     }
//   };

//   // Handle starting an errand
//   const handleStartErrand = async (errandId) => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/errand/${errandId}/start`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }
//       );
//       if (response.data.status) {
//         toast.success('Booking started!', {
//           style: { background: 'white', color: 'black' },
//         });
//       }
//     } catch (error) {
//       console.error('Error starting booking:', error);
//       toast.error('Failed to start booking', {
//         style: { background: 'white', color: 'red' },
//       });
//     }
//   };

//   // Handle completing an errand
//   const handleCompleteErrand = async (errandId) => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/errand/${errandId}/complete`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }
//       );
//       if (response.data.status) {
//         toast.success('Booking completed!', {
//           style: { background: 'white', color: 'black' },
//         });
//         // Stop tracking when errand is completed
//         setTrackingErrand(null);
//         setErranderPosition(null);
//       }
//     } catch (error) {
//       console.error('Error completing booking:', error);
//       toast.error('Failed to complete booking', {
//         style: { background: 'white', color: 'red' },
//       });
//     }
//   };

//   // Filter bookings based on the active tab
//   const filteredBookings = history.filter((booking) => {
//     if (activeTab === 'pending') return booking.status === 'pending';
//     if (activeTab === 'accepted') return booking.status === 'accepted' || booking.status === 'in_progress' || booking.status === 'completed';
//     if (activeTab === 'rejected') return booking.status === 'rejected';
//     return false;
//   });

//   return (
//     <>
//       <Navbar />
//       <div className="flex min-h-screen bg-gray-100 font-sans">
//         {/* Sidebar */}
//         <div
//           className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform lg:transform-none transition-transform duration-300 ease-in-out z-50 ${
//             isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           } lg:translate-x-0 lg:w-1/5 p-6 flex flex-col justify-between`}
//         >
//           <div>
//             {/* Sidebar Header with Close Button on Mobile */}
//             <div className="flex items-center justify-between mb-8">
//               <div className="flex items-center">
//                 <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-900 rounded-md mr-2"></div>
//                 <h1 className="text-xl font-bold text-gray-800">E_Errands</h1>
//               </div>
//               <button
//                 className="lg:hidden text-gray-600 hover:text-gray-800"
//                 onClick={() => setIsSidebarOpen(false)}
//               >
//                 <FaTimes size={24} />
//               </button>
//             </div>
//             <nav>
//               <ul className="space-y-4">
//                 <li>
//                   <Link
//                     to="/erranderdashboard"
//                     className={`flex items-center ${
//                       location.pathname === '/erranderdashboard' ? 'text-gray-800 font-semibold' : 'text-gray-600 hover:text-gray-800'
//                     }`}
//                     onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click in mobile view
//                   >
//                     <FaChartBar className="mr-3 text-gray-500" /> Dashboard
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="#"
//                     className="flex items-center text-gray-600 hover:text-gray-800"
//                     onClick={() => setIsSidebarOpen(false)}
//                   >
//                     <FaChartBar className="mr-3 text-gray-500" /> MyErranders
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/userprofile"
//                     className={`flex items-center ${
//                       location.pathname === '/userprofile' ? 'text-gray-800 font-semibold' : 'text-gray-600 hover:text-gray-800'
//                     }`}
//                     onClick={() => setIsSidebarOpen(false)}
//                   >
//                     <FaHotel className="mr-3 text-gray-500" /> Profile
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="#"
//                     className="flex items-center text-gray-600 hover:text-gray-800"
//                     onClick={() => setIsSidebarOpen(false)}
//                   >
//                     <FaCar className="mr-3 text-gray-500" /> Reports
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="#"
//                     className="flex items-center text-gray-600 hover:text-gray-800"
//                     onClick={() => setIsSidebarOpen(false)}
//                   >
//                     <FaPlane className="mr-3 text-gray-500" /> Statistics
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/login"
//                     className="flex items-center text-red-600 hover:text-gray-800"
//                     onClick={() => setIsSidebarOpen(false)}
//                   >
//                     <FaUser className="mr-3 text-red-500" /> Logout
//                   </Link>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//           <div className="flex items-center">
//             <img
//               src={profile.profilePicture || 'https://randomuser.me/api/portraits/women/44.jpg'}
//               alt="User"
//               className="w-10 h-10 rounded-full mr-3"
//             />
//             <div>
//               <p className="text-green-800">{profile?.userId?.email}</p>
//               <p className="text-gray-800 font-semibold">{profile?.userId?.firstName} {profile?.userId?.lastName}</p>
//               <Link to="#" className="text-gray-600 text-sm hover:underline">
//                 Visit site
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Overlay for mobile sidebar */}
//         {isSidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//             onClick={() => setIsSidebarOpen(false)}
//           />
//         )}

//         {/* Main Content */}
//         <div className="flex-1 p-6 lg:p-8">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center">
//               <button
//                 className="lg:hidden mr-4 text-gray-600 hover:text-gray-800 transition-colors duration-200"
//                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               >
//                 {isSidebarOpen ? (
//                   <FaTimes size={24} className="text-green-500" />
//                 ) : (
//                   <FaBars size={24} className="text-green-500" />
//                 )}
//               </button>
//               <h2 className="text-2xl font-bold text-gray-800">Errander Dashboard</h2>
//             </div>
//           </div>

//           <div className="ml-0 lg:ml-[20%] p-6 rounded-xl max-w-7xl mx-auto">
//             {/* Notifications Section */}
//             <div className="mb-6">
//               <h3 className="text-xl font-bold text-gray-800 mb-4">Notifications</h3>
//               {notifications.length > 0 ? (
//                 <ul className="space-y-2">
//                   {notifications.map((notification) => (
//                     <li
//                       key={notification._id}
//                       className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
//                     >
//                       {/* <span>{notification.message}</span> */}
//                       <span>You have a new errand request</span>
//                       <span className="text-gray-500 text-sm">{new Date(notification.createdAt).toLocaleString()}</span>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-600">No notifications available.</p>
//               )}
//             </div>

//             {/* Errand History (Chats) Section */}
//             <div className="mt-6">
//               <h3 className="text-xl font-bold text-gray-800 mb-4">My Bookings</h3>
//               <div className="flex space-x-4 mb-4">
//                 <button
//                   className={`px-4 py-2 rounded-md ${activeTab === 'pending' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
//                   onClick={() => setActiveTab('pending')}
//                 >
//                   Pending
//                 </button>
//                 <button
//                   className={`px-4 py-2 rounded-md ${activeTab === 'accepted' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
//                   onClick={() => setActiveTab('accepted')}
//                 >
//                   Accepted
//                 </button>
//                 <button
//                   className={`px-4 py-2 rounded-md ${activeTab === 'rejected' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
//                   onClick={() => setActiveTab('rejected')}
//                 >
//                   Rejected
//                 </button>
//               </div>
//               {filteredBookings.length > 0 ? (
//                 <div className="space-y-4">
//                   {filteredBookings.map((booking) => (
//                     <div
//                       key={booking._id}
//                       className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
//                     >
//                       <div>
//                         <p className="text-gray-800 font-semibold">
//                           Client: <span className="font-normal">{booking.clientId?.firstName} {booking.clientId?.lastName}</span>
//                         </p>
//                         <p className="text-gray-800 font-semibold">
//                           Client Phone Number: <span className="font-normal">{booking.clientId?.phone}</span>
//                         </p>
//                         <p className="text-gray-800 font-semibold">
//                           Client Email: <span className="font-normal">{booking.clientId?.email}</span>
//                         </p>
//                         <p className="text-gray-800 font-semibold">
//                           Pickup: <span className="font-normal">{booking.pickupAddress}</span>
//                         </p>
//                         <p className="text-gray-800 font-semibold">
//                           Destination: <span className="font-normal">{booking.destinationAddress}</span>
//                         </p>
//                         <p className="text-gray-800 font-semibold">
//                           Package: <span className="font-normal">{booking.packageDescription}</span>
//                         </p>
//                         <div className="flex items-center mt-2">
//                           <img
//                             src={booking.packagePicture || 'https://via.placeholder.com/50'}
//                             alt={`${booking.clientId?.firstName}'s profile`}
//                             className="w-12 h-12 rounded-full mr-2"
//                           />
//                           <button
//                             onClick={() => window.open(booking.packagePicture || 'https://via.placeholder.com/50', '_blank')}
//                           >
//                             <FaEye className="inline mr-1" /> View Picture
//                           </button>
//                         </div>
//                         <p className="text-gray-800 font-semibold">
//                           Price: <span className="font-normal">₦{booking.calculatedPrice}</span>
//                         </p>
//                         <p className="text-gray-800 font-semibold">
//                           Payment Method: <span className="font-normal">{booking.paymentMethod}</span>
//                         </p>
//                         <p className="text-gray-800 font-semibold">
//                           Status: <span className="font-normal">{booking.status}</span>
//                         </p>
//                         <p className="text-gray-800 font-semibold">
//                           Created: <span className="font-normal">{new Date(booking.createdAt).toLocaleString()}</span>
//                         </p>
//                         {/* Errander actions */}
//                         {booking.erranderId?._id === profile.userId._id && (
//                           <div className="flex gap-2 mt-2">
//                             {booking.status === 'pending' && (
//                               <>
//                                 <button
//                                   className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
//                                   onClick={() => handleAcceptErrand(booking._id)}
//                                 >
//                                   Accept
//                                 </button>
//                                 <button
//                                   className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
//                                   onClick={() => handleRejectErrand(booking._id)}
//                                 >
//                                   Reject
//                                 </button>
//                               </>
//                             )}
//                             {booking.status === 'accepted' && (
//                               <button
//                                 className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
//                                 onClick={() => handleStartErrand(booking._id)}
//                               >
//                                 Start Booking
//                               </button>
//                             )}
//                             {booking.status === 'in_progress' && (
//                               <button
//                                 className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
//                                 onClick={() => handleCompleteErrand(booking._id)}
//                               >
//                                 Complete Booking
//                               </button>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                       {/* Tracking for in_progress bookings */}
//                       {booking.status === 'in_progress' && (
//                         <button
//                           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
//                           onClick={() => setTrackingErrand(booking)}
//                         >
//                           Track Booking
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-600">No bookings available for this status.</p>
//               )}
//             </div>

//             {/* Tracking Modal */}
//             {trackingErrand && isLoaded && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//                 <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
//                   <h3 className="text-xl font-bold text-gray-800 mb-4">Tracking Booking</h3>
//                   <GoogleMap
//                     mapContainerStyle={{ width: '100%', height: '400px' }}
//                     center={erranderPosition || (trackingErrand.pickupCoords || { lat: 6.5244, lng: 3.3792 })}
//                     zoom={10}
//                   >
//                     {erranderPosition && <Marker position={erranderPosition} label="Errander" />}
//                     {trackingErrand.pickupCoords && (
//                       <Marker
//                         position={trackingErrand.pickupCoords}
//                         label="Pickup"
//                         icon={{
//                           url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
//                         }}
//                       />
//                     )}
//                     {trackingErrand.destinationCoords && (
//                       <Marker
//                         position={trackingErrand.destinationCoords}
//                         label="Destination"
//                         icon={{
//                           url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
//                         }}
//                       />
//                     )}
//                   </GoogleMap>
//                   <div className="flex justify-end gap-4 mt-4">
//                     <button
//                       className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
//                       onClick={() => {
//                         setTrackingErrand(null);
//                         setErranderPosition(null);
//                       }}
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default MyErrander;



import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaChartBar, FaHotel, FaCar, FaPlane, FaUser, FaEye, FaTimes } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import io from 'socket.io-client';
import { GoogleMap, Marker, useLoadScript, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';

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
  const [routeInfo, setRouteInfo] = useState({ distance: 'Calculating...', duration: 'Calculating...' }); // Store selected route info
  const [isRideStarted, setIsRideStarted] = useState(false); // Track if the ride has started
  const [directions, setDirections] = useState(null); // Store the selected route directions
  const [possibleRoutes, setPossibleRoutes] = useState([]); // Store all possible routes
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0); // Track the selected route
  const [locationPermission, setLocationPermission] = useState('prompt'); // Track geolocation permission status

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

  // Check location permission status
  const checkLocationPermission = async () => {
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setLocationPermission(result.state);
        result.onchange = () => setLocationPermission(result.state);
      } catch (error) {
        console.error('Error checking location permission:', error);
      }
    }
  };

  // Calculate midpoint for distance InfoWindow
  const getRouteMidpoint = () => {
    if (trackingErrand?.pickupCoords && trackingErrand?.destinationCoords) {
      const lat = (trackingErrand.pickupCoords.lat + trackingErrand.destinationCoords.lat) / 2;
      const lng = (trackingErrand.pickupCoords.lng + trackingErrand.destinationCoords.lng) / 2;
      return { lat, lng };
    }
    return null;
  };

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
    checkLocationPermission();
  }, [navigate]);

  // Fetch bookings and notifications, and set up Socket.IO
  useEffect(() => {
    if (profile?.userId?._id) {
      socket.emit('join', profile.userId._id);

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

  // Fetch initial errander position with retry logic
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;

    const getPosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setErranderPosition(newPosition);
            setLocationPermission('granted');
            socket.emit('updateLocation', {
              userId: profile.userId._id,
              errandId: trackingErrand._id,
              position: newPosition,
            });
          },
          (error) => {
            console.error('Initial geolocation error:', error);
            if (error.code === error.PERMISSION_DENIED) {
              setLocationPermission('denied');
              toast.error('Location access denied. Please enable location services in your browser settings.', {
                style: { background: 'white', color: 'red' },
              });
            } else if (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT) {
              if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(getPosition, 2000); // Retry after 2 seconds
              } else {
                toast.error('Failed to get your location after multiple attempts. Please try again.', {
                  style: { background: 'white', color: 'red' },
                });
              }
            } else {
              toast.error('An error occurred while fetching your location.', {
                style: { background: 'white', color: 'red' },
              });
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        setLocationPermission('denied');
        toast.error('Geolocation is not supported by your browser.', {
          style: { background: 'white', color: 'red' },
        });
      }
    };

    if (trackingErrand && trackingErrand.status === 'in_progress' && !erranderPosition) {
      getPosition();
    }
  }, [trackingErrand, profile]);

  // Real-time location tracking for in_progress errands
  useEffect(() => {
    let watchId;
    if (trackingErrand && trackingErrand.status === 'in_progress' && isRideStarted) {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const newPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setErranderPosition(newPosition);
            socket.emit('updateLocation', {
              userId: profile.userId._id,
              errandId: trackingErrand._id,
              position: newPosition,
            });
          },
          (error) => {
            console.error('Geolocation error:', error);
            toast.error('Failed to get your location during tracking.', {
              style: { background: 'white', color: 'red' },
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        toast.error('Geolocation is not supported by your browser.', {
          style: { background: 'white', color: 'red' },
        });
      }
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [trackingErrand, profile, isRideStarted]);

  // Calculate possible routes when tracking starts
  useEffect(() => {
    if (trackingErrand && isLoaded && trackingErrand.pickupCoords && trackingErrand.destinationCoords) {
      console.log('Calculating routes for:', trackingErrand.pickupCoords, trackingErrand.destinationCoords);
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: trackingErrand.pickupCoords,
          destination: trackingErrand.destinationCoords,
          travelMode: window.google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
        },
        (result, status) => {
          console.log('Directions result:', result, 'Status:', status);
          if (status === window.google.maps.DirectionsStatus.OK && result.routes.length > 0) {
            setPossibleRoutes(result.routes);
            setDirections(result);
            const route = result.routes[0].legs[0];
            setRouteInfo({
              distance: route.distance.text,
              duration: route.duration.text,
            });
            setSelectedRouteIndex(0);
          } else {
            console.error('Directions request failed:', status);
            toast.error('Failed to calculate routes.', {
              style: { background: 'white', color: 'red' },
            });
            setRouteInfo({ distance: 'N/A', duration: 'N/A' });
          }
        }
      );
    }
  }, [trackingErrand, isLoaded]);

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
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === errandId ? { ...booking, status: 'accepted' } : booking
          )
        );
        setHistory((prev) =>
          prev.map((booking) =>
            booking._id === errandId ? { ...booking, status: 'accepted' } : booking
          )
        );
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast.error('Failed to accept booking.', {
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
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === errandId ? { ...booking, status: 'rejected' } : booking
          )
        );
        setHistory((prev) =>
          prev.map((booking) =>
            booking._id === errandId ? { ...booking, status: 'rejected' } : booking
          )
        );
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Failed to reject booking.', {
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
        const booking = bookings.find((b) => b._id === errandId);
        if (booking) {
          setTrackingErrand({ ...booking, status: 'in_progress' });
          setBookings((prev) =>
            prev.map((b) =>
              b._id === errandId ? { ...b, status: 'in_progress' } : b
            )
          );
          setHistory((prev) =>
            prev.map((b) =>
              b._id === errandId ? { ...b, status: 'in_progress' } : b
            )
          );
        }
      }
    } catch (error) {
      console.error('Error starting booking:', error);
      toast.error('Failed to start booking.', {
        style: { background: 'white', color: 'red' },
      });
    }
  };

  // Handle starting the ride (real-time tracking)
  const handleStartRide = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.', {
        style: { background: 'white', color: 'red' },
      });
      return;
    }

    if (locationPermission === 'denied') {
      toast.error('Location access is denied. Please enable location services in your browser settings.', {
        style: { background: 'white', color: 'red' },
      });
      return;
    }

    if (!erranderPosition) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setErranderPosition(newPosition);
          setLocationPermission('granted');
          setIsRideStarted(true);
          socket.emit('updateLocation', {
            userId: profile.userId._id,
            errandId: trackingErrand._id,
            position: newPosition,
          });
          toast.success('Ride started! Your location is now being tracked.', {
            style: { background: 'white', color: 'black' },
          });
        },
        (error) => {
          console.error('Geolocation error on start ride:', error);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationPermission('denied');
            toast.error('Location access denied. Please enable location services in your browser settings.', {
              style: { background: 'white', color: 'red' },
            });
          } else {
            toast.error('Failed to get your location. Please try again.', {
              style: { background: 'white', color: 'red' },
            });
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setIsRideStarted(true);
      toast.success('Ride started! Your location is now being tracked.', {
        style: { background: 'white', color: 'black' },
      });
    }
  };

  // Handle canceling an errand
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
        toast.success('Booking canceled!', {
          style: { background: 'white', color: 'black' },
        });
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === errandId ? { ...booking, status: 'canceled' } : booking
          )
        );
        setHistory((prev) =>
          prev.map((booking) =>
            booking._id === errandId ? { ...booking, status: 'canceled' } : booking
          )
        );
        setTrackingErrand(null);
        setErranderPosition(null);
        setIsRideStarted(false);
        setDirections(null);
        setRouteInfo({ distance: 'Calculating...', duration: 'Calculating...' });
        setPossibleRoutes([]);
        setSelectedRouteIndex(0);
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      toast.error('Failed to cancel booking.', {
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
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === errandId ? { ...booking, status: 'completed' } : booking
          )
        );
        setHistory((prev) =>
          prev.map((booking) =>
            booking._id === errandId ? { ...booking, status: 'completed' } : booking
          )
        );
        setTrackingErrand(null);
        setErranderPosition(null);
        setIsRideStarted(false);
        setDirections(null);
        setRouteInfo({ distance: 'Calculating...', duration: 'Calculating...' });
        setPossibleRoutes([]);
        setSelectedRouteIndex(0);
      }
    } catch (error) {
      console.error('Error completing booking:', error);
      toast.error('Failed to complete booking.', {
        style: { background: 'white', color: 'red' },
      });
    }
  };

  // Handle route selection
  const handleRouteSelect = (index) => {
    console.log('Selecting route index:', index);
    setSelectedRouteIndex(index);
    const selectedRoute = possibleRoutes[index];
    setDirections({ routes: [selectedRoute] });
    const route = selectedRoute.legs[0];
    setRouteInfo({
      distance: route.distance.text,
      duration: route.duration.text,
    });
  };

  // Filter bookings based on the active tab
  const filteredBookings = history.filter((booking) => {
    if (activeTab === 'pending') return booking.status === 'pending';
    if (activeTab === 'accepted') return ['accepted', 'in_progress', 'completed', 'canceled'].includes(booking.status);
    if (activeTab === 'rejected') return booking.status === 'rejected';
    return false;
  });

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100 font-sans">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform lg:transform-none transition-transform duration-300 ease-in-out z-50 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:w-1/5 p-6 flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-900 rounded-md mr-2"></div>
                <h1 className="text-xl font-bold text-gray-800">E_Errands</h1>
              </div>
              <button
                className="lg:hidden text-gray-600 hover:text-gray-800"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaTimes size={24} />
              </button>
            </div>
            <nav>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/erranderdashboard"
                    className={`flex items-center ${
                      location.pathname === '/erranderdashboard' ? 'text-gray-800 font-semibold' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaChartBar className="mr-3 text-gray-500" /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="flex items-center text-gray-600 hover:text-gray-800"
                    onClick={() => setIsSidebarOpen(false)}
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
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaHotel className="mr-3 text-gray-500" /> Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="flex items-center text-gray-600 hover:text-gray-800"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaCar className="mr-3 text-gray-500" /> Reports
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="flex items-center text-gray-600 hover:text-gray-800"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaPlane className="mr-3 text-gray-500" /> Statistics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="flex items-center text-red-600 hover:text-gray-800"
                    onClick={() => setIsSidebarOpen(false)}
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

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <FaTimes size={24} className="text-green-500" />
                ) : (
                  <FaBars size={24} className="text-green-500" />
                )}
              </button>
              <h2 className="text-2xl font-bold text-gray-800">Errander Dashboard</h2>
            </div>
          </div>

          <div className="ml-0 lg:ml-[20%] p-6 rounded-xl max-w-7xl mx-auto">
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
                      <span>You have a new errand request</span>
                      <span className="text-gray-500 text-sm">{new Date(notification.createdAt).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No notifications available.</p>
              )}
            </div>

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
                  onClick={() => setActiveTab('accepted')}
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
                          Client: <span className="font-normal">{booking.clientId?.firstName} {booking.clientId?.lastName}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Client Phone Number: <span className="font-normal">{booking.clientId?.phone}</span>
                        </p>
                        <p className="text-gray-800 font-semibold">
                          Client Email: <span className="font-normal">{booking.clientId?.email}</span>
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
                        {booking.erranderId?._id === profile.userId?._id && (
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
                  {locationPermission === 'denied' && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                      <p>Location access is denied. Please enable location services in your browser settings to start the ride.</p>
                    </div>
                  )}
                  <div className="mb-4 text-gray-700">
                    <p><strong>Pickup Address:</strong> {trackingErrand.pickupAddress}</p>
                    <p><strong>Destination Address:</strong> {trackingErrand.destinationAddress}</p>
                    <p><strong>Distance:</strong> {routeInfo.distance}</p>
                    <p><strong>Estimated Time:</strong> {routeInfo.duration}</p>
                  </div>
                  {possibleRoutes.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Select Route</h4>
                      <div className="flex flex-wrap gap-2">
                        {possibleRoutes.map((route, index) => (
                          <button
                            key={index}
                            className={`px-4 py-2 rounded-md ${
                              selectedRouteIndex === index
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                            } hover:bg-blue-400 hover:text-white transition`}
                            onClick={() => handleRouteSelect(index)}
                          >
                            Route {index + 1}: {route.legs[0].distance.text}, {route.legs[0].duration.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '400px' }}
                    center={erranderPosition || trackingErrand.pickupCoords || { lat: 6.5244, lng: 3.3792 }}
                    zoom={14}
                    options={{
                      mapTypeControl: false,
                      streetViewControl: false,
                    }}
                  >
                    {trackingErrand.pickupCoords && (
                      <>
                        <Marker
                          position={trackingErrand.pickupCoords}
                          label="Pickup"
                          icon={{
                            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                          }}
                        />
                        <InfoWindow position={trackingErrand.pickupCoords}>
                          <div className="text-sm font-semibold text-gray-800">
                            Pickup: {trackingErrand.pickupAddress}
                          </div>
                        </InfoWindow>
                      </>
                    )}
                    {trackingErrand.destinationCoords && (
                      <>
                        <Marker
                          position={trackingErrand.destinationCoords}
                          label="Destination"
                          icon={{
                            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                          }}
                        />
                        <InfoWindow position={trackingErrand.destinationCoords}>
                          <div className="text-sm font-semibold text-gray-800">
                            Destination: {trackingErrand.destinationAddress}
                          </div>
                        </InfoWindow>
                      </>
                    )}
                    {erranderPosition && (
                      <Marker
                        position={erranderPosition}
                        label="Errander"
                        icon={{
                          url: 'https://img.icons8.com/color/48/000000/car.png',
                          scaledSize: new window.google.maps.Size(40, 40),
                        }}
                      />
                    )}
                    {directions && routeInfo.distance !== 'N/A' && getRouteMidpoint() && (
                      <InfoWindow position={getRouteMidpoint()}>
                        <div className="text-sm font-semibold text-gray-800">
                          Distance: {routeInfo.distance}
                        </div>
                      </InfoWindow>
                    )}
                    {directions && (
                      <DirectionsRenderer
                        directions={directions}
                        options={{
                          polylineOptions: {
                            strokeColor: selectedRouteIndex === 0 ? '#FF0000' : selectedRouteIndex === 1 ? '#00FF00' : '#0000FF',
                            strokeOpacity: 0.8,
                            strokeWeight: 5,
                          },
                        }}
                      />
                    )}
                  </GoogleMap>
                  <div className="flex justify-end gap-4 mt-4">
                    {!isRideStarted && (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        onClick={handleStartRide}
                      >
                        Start Ride
                      </button>
                    )}
                    {isRideStarted && (
                      <>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                          onClick={() => handleCancelErrand(trackingErrand._id)}
                        >
                          Cancel Ride
                        </button>
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                          onClick={() => handleCompleteErrand(trackingErrand._id)}
                        >
                          Complete Ride
                        </button>
                      </>
                    )}
                    <button
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                      onClick={() => {
                        setTrackingErrand(null);
                        setErranderPosition(null);
                        setIsRideStarted(false);
                        setDirections(null);
                        setRouteInfo({ distance: 'Calculating...', duration: 'Calculating...' });
                        setPossibleRoutes([]);
                        setSelectedRouteIndex(0);
                      }}
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