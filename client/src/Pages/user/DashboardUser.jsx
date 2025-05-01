// import { useEffect, useState } from 'react';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
// import { Doughnut, Bar } from 'react-chartjs-2';
// import { FaBars, FaChartBar, FaHotel, FaCar, FaPlane, FaUser, FaCog } from 'react-icons/fa';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import Navbar from '../../components/Navbar';
// import io from 'socket.io-client';
// import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
// import ProfileUser from './ProfileUser';
// import TelephoneHistory from './TelephoneHistory';

// // Initialize Socket.IO client
// const socket = io(import.meta.env.VITE_BACKEND_URL);

// // Register Chart.js components
// ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// function DashboardUser() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [profile, setProfile] = useState({});
//   const [clicks, setClicks] = useState(0);
//   const [bookings, setBookings] = useState([]);
//   const [trackingErrand, setTrackingErrand] = useState(null);
//   const [erranderPosition, setErranderPosition] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Load Google Maps script
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       try {
//         const profileResponse = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/auth/erranderdashboard`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         const profileData = profileResponse.data?.profile || {};
//         setProfile(profileData);

//         if (profileData.slug) {
//           const clicksResponse = await axios.get(
//             `${import.meta.env.VITE_BACKEND_URL}/api/profile/get-clicks/${profileData.slug}`
//           );
//           setClicks(clicksResponse.data.clicks || 0);
//         }

//         const bookingsResponse = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/errand/history`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setBookings(bookingsResponse.data.history || []);

//         toast.success('You are welcome back', {
//           style: { background: '#4CAF50', color: 'white' },
//         });
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//         toast.error('An error occurred while fetching dashboard data', {
//           style: { background: '#F44', color: 'white' },
//         });
//         if (error.response?.status === 401 || error.response?.status === 404) {
//           localStorage.removeItem('token');
//           navigate('/login');
//         }
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   // Socket.IO listeners for real-time updates
//   useEffect(() => {
//     if (profile?.userId?._id) {
//       socket.emit('join', profile.userId._id);

//       socket.on('errandUpdate', (errand) => {
//         if (errand.clientId._id === profile.userId._id) {
//           setBookings((prev) =>
//             prev.map((e) => (e._id === errand._id ? errand : e))
//           );
//           if (errand.status === 'in_progress') {
//             setTrackingErrand(errand);
//           } else if (errand.status === 'completed') {
//             setTrackingErrand(null);
//             setErranderPosition(null);
//           }
//           toast.info(`Your errand status updated: ${errand.status}`);
//         }
//       });

//       socket.on('notification', (notification) => {
//         toast.info(notification.message);
//       });

//       socket.on('erranderLocation', ({ errandId, position }) => {
//         if (trackingErrand && trackingErrand._id === errandId) {
//           setErranderPosition(position);
//         }
//       });

//       return () => {
//         socket.off('errandUpdate');
//         socket.off('notification');
//         socket.off('erranderLocation');
//       };
//     }
//   }, [profile, trackingErrand]);

//   const totalBookings = bookings.length || 0;
//   const totalViews = clicks || 0;

//   const maxBookings = 100;
//   const maxViews = 1000;
//   const bookingsPercentage = totalBookings > 0 ? Math.round((totalBookings / maxBookings) * 100) : 0;
//   const viewsPercentage = totalViews > 0 ? Math.round((totalViews / maxViews) * 100) : 0;

//   const bookingsData = {
//     labels: ['Bookings'],
//     datasets: [
//       {
//         data: [bookingsPercentage, 100 - bookingsPercentage],
//         backgroundColor: ['#4A90E2', '#E5E7EB'],
//         borderWidth: 0,
//       },
//     ],
//   };

//   const viewsData = {
//     labels: ['Views'],
//     datasets: [
//       {
//         data: [viewsPercentage, 100 - viewsPercentage],
//         backgroundColor: ['#4A90E2', '#E5E7EB'],
//         borderWidth: 0,
//       },
//     ],
//   };

//   const userBookings = bookings.filter(booking => booking.clientId._id === profile.userId?._id);
//   const totalUserBookings = userBookings.length;

//   const acceptedBookings = userBookings.filter(booking => booking.status === 'accepted' || booking.status === 'in_progress').length;
//   const canceledBookings = userBookings.filter(booking => booking.status === 'canceled').length;
//   const completedBookings = userBookings.filter(booking => booking.status === 'completed').length;

//   const totalOtherCategories = acceptedBookings + canceledBookings + completedBookings;
//   const normalizedAcceptedPercentage = totalOtherCategories > 0 ? Math.round((acceptedBookings / totalOtherCategories) * 100) : 0;
//   const normalizedCanceledPercentage = totalOtherCategories > 0 ? Math.round((canceledBookings / totalOtherCategories) * 100) : 0;
//   const normalizedCompletedPercentage = totalOtherCategories > 0 ? Math.round((completedBookings / totalOtherCategories) * 100) : 0;
//   const normalizedTotalBookingsPercentage = totalUserBookings;

//   const errandsData = {
//     labels: ['Accepted by Erranders', 'Total Bookings Made', 'Canceled Bookings', 'Completed Bookings'],
//     datasets: [
//       {
//         data: [
//           normalizedAcceptedPercentage,
//           normalizedTotalBookingsPercentage,
//           normalizedCanceledPercentage,
//           normalizedCompletedPercentage,
//         ],
//         backgroundColor: ['#4A90E2', '#50C878', '#FF6B6B', '#F5E050'],
//         borderWidth: 0,
//       },
//     ],
//   };

//   const acceptedBookingsWithErranders = userBookings.filter(booking => booking.status === 'accepted' || booking.status === 'in_progress');
//   const uniqueErranders = [...new Set(acceptedBookingsWithErranders.map(booking => booking.erranderId._id))]
//     .map(id => acceptedBookingsWithErranders.find(booking => booking.erranderId._id === id).errander);

//   const todayReportData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr'],
//     datasets: [
//       {
//         label: 'Marketing',
//         data: [15, 10, 20, 5],
//         backgroundColor: '#4A90E2',
//         borderRadius: 5,
//       },
//       {
//         label: 'Design',
//         data: [10, 15, 5, 20],
//         backgroundColor: '#F5E050',
//         borderRadius: 5,
//       },
//     ],
//   };

//   const renderMainContent = () => {
//     if (location.pathname === '/profile') {
//       return <ProfileUser />;
//     }
//     if (location.pathname === '/telephone-history') {
//       return <TelephoneHistory />;
//     }

//     return (
//       <div className="flex-1 p-6 lg:p-8">
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex items-center">
//             <button
//               className="lg:hidden mr-4 text-gray-600"
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             >
//               <FaBars size={24} />
//             </button>
//             <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//           <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
//             <div className="p-4 bg-green-100 rounded-lg mr-4">
//               <FaUser className="text-green-600 text-2xl" />
//             </div>
//             <div>
//               <p className="text-gray-600">Erranders</p>
//               <p className="text-2xl font-bold text-gray-800">{uniqueErranders.length}</p>
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
//             <div className="p-4 bg-blue-100 rounded-lg mr-4">
//               <FaHotel className="text-blue-600 text-2xl" />
//             </div>
//             <div>
//               <p className="text-gray-600">Bookings</p>
//               <p className="text-2xl font-bold text-gray-800">{bookingsPercentage}</p>
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
//             <div className="p-4 bg-red-100 rounded-lg mr-4">
//               <FaChartBar className="text-red-600 text-2xl" />
//             </div>
//             <div>
//               <p className="text-gray-600">Earnings</p>
//               <p className="text-2xl font-bold text-gray-800">95,540 $</p>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               <div className="bg-white p-6 rounded-xl shadow-md">
//                 <p className="text-gray-600 mb-2">Total Bookings</p>
//                 <p className="text-2xl font-bold text-gray-800">{totalBookings}</p>
//                 <p className="text-gray-600">{bookingsPercentage}%</p>
//                 <div className="mt-4 w-16 h-16">
//                   <Doughnut
//                     data={bookingsData}
//                     options={{
//                       cutout: '70%',
//                       plugins: { legend: { display: false } },
//                     }}
//                   />
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-xl shadow-md">
//                 <p className="text-gray-600 mb-2">Total Views</p>
//                 <p className="text-2xl font-bold text-gray-800">{totalViews}</p>
//                 <p className="text-gray-600">{viewsPercentage}%</p>
//                 <div className="mt-4 w-16 h-16">
//                   <Doughnut
//                     data={viewsData}
//                     options={{
//                       cutout: '70%',
//                       plugins: { legend: { display: false } },
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-md">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Today Report</h3>
//                 <span className="text-red-500 font-semibold">6,230 $</span>
//               </div>
//               <div className="h-64">
//                 <Bar
//                   data={todayReportData}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     scales: {
//                       y: {
//                         beginAtZero: true,
//                         ticks: {
//                           callback: (value) => `${value}k $`,
//                         },
//                       },
//                     },
//                     plugins: {
//                       legend: { display: false },
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="space-y-6">
//             <div className="bg-white p-6 rounded-xl shadow-md">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Erranders</h3>
//                 <span className="text-red-500 font-semibold">{uniqueErranders.length}</span>
//               </div>
//               <div className="flex space-x-2">
//                 {uniqueErranders.length > 0 ? (
//                   uniqueErranders.slice(0, 5).map((errander, i) => (
//                     <img
//                       key={i}
//                       src={errander.profilePicture || `https://randomuser.me/api/portraits/men/${i + 1}.jpg`}
//                       alt="Errander"
//                       className="w-10 h-10 rounded-full"
//                     />
//                   ))
//                 ) : (
//                   <p className="text-gray-600">No erranders have accepted your bookings yet.</p>
//                 )}
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-md">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Errands Breakdowns</h3>
//               <div className="relative w-40 h-40 mx-auto">
//                 <Doughnut
//                   data={errandsData}
//                   options={{
//                     cutout: '70%',
//                     plugins: {
//                       legend: { display: false },
//                     },
//                   }}
//                 />
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="text-2xl font-bold text-gray-800">{normalizedAcceptedPercentage}%</span>
//                 </div>
//               </div>
//               <div className="mt-4 space-y-2">
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
//                   <span className="text-gray-600">Accepted by Erranders: {normalizedAcceptedPercentage}%</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
//                   <span className="text-gray-600">Total Bookings Made: {normalizedTotalBookingsPercentage}%</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
//                   <span className="text-gray-600">Canceled Bookings: {normalizedCanceledPercentage}%</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
//                   <span className="text-gray-600">Completed Bookings: {normalizedCompletedPercentage}%</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tracking Modal for Client */}
//         {trackingErrand && isLoaded && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
//               <h3 className="text-xl font-bold text-gray-800 mb-4">Tracking Your Errand</h3>
//               <GoogleMap
//                 mapContainerStyle={{ width: '100%', height: '400px' }}
//                 center={erranderPosition || (trackingErrand.pickupCoords || { lat: 6.5244, lng: 3.3792 })}
//                 zoom={10}
//               >
//                 {erranderPosition && <Marker position={erranderPosition} label="Errander" />}
//                 {trackingErrand.pickupCoords && (
//                   <Marker
//                     position={trackingErrand.pickupCoords}
//                     label="Pickup"
//                     icon={{
//                       url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
//                     }}
//                   />
//                 )}
//                 {trackingErrand.destinationCoords && (
//                   <Marker
//                     position={trackingErrand.destinationCoords}
//                     label="Destination"
//                     icon={{
//                       url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
//                     }}
//                   />
//                 )}
//               </GoogleMap>
//               <div className="flex justify-end gap-4 mt-4">
//                 <button
//                   className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
//                   onClick={() => {
//                     setTrackingErrand(null);
//                     setErranderPosition(null);
//                   }}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="flex min-h-screen bg-gray-100 font-sans">
//         <div
//           className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
//             isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 lg:static lg:w-1/5 p-6 flex flex-col justify-between`}
//         >
//           <div>
//             <div className="flex items-center mb-8">
//               <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-900 rounded-md mr-2"></div>
//               <h1 className="text-xl font-bold text-gray-800">E_Errands</h1>
//             </div>
//             <nav>
//               <ul className="space-y-4">
//                 <li>
//                   <Link
//                     to="/dashboard"
//                     className={`flex items-center ${
//                       location.pathname === '/dashboard' ? 'text-gray-800 font-semibold' : 'text-gray-600 hover:text-gray-800'
//                     }`}
//                   >
//                     <FaChartBar className="mr-3 text-gray-500" /> Dashboard
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/errandersInDashboard"
//                     className="flex items-center text-gray-600 hover:text-gray-800"
//                   >
//                     <FaChartBar className="mr-3 text-gray-500" /> Erranders
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/profile"
//                     className={`flex items-center ${
//                       location.pathname === '/profile' ? 'text-gray-800 font-semibold' : 'text-gray-600 hover:text-gray-800'
//                     }`}
//                   >
//                     <FaHotel className="mr-3 text-gray-500" /> Profile
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/telephone-history"
//                     className="flex items-center text-gray-600 hover:text-gray-800"
//                   >
//                     <FaCar className="mr-3 text-gray-500" /> Telephone-history
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="#"
//                     className="flex items-center text-gray-600 hover:text-gray-800"
//                   >
//                     <FaPlane className="mr-3 text-gray-500" /> Statistics
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/login"
//                     className="flex items-center text-red-600 hover:text-gray-800"
//                   >
//                     <FaUser className="mr-3 text-gray-500" /> Logout
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

//         {renderMainContent()}
//       </div>
//     </>
//   );
// }

// export default DashboardUser;






import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { FaBars, FaChartBar, FaHotel, FaCar, FaPlane, FaUser, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import io from 'socket.io-client';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import ProfileUser from './ProfileUser';
import TelephoneHistory from './TelephoneHistory';
import ErrandersInDashboard from './ErrandersInDashboard';

// Initialize Socket.IO client
const socket = io(import.meta.env.VITE_BACKEND_URL);

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function DashboardUser() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const [clicks, setClicks] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [trackingErrand, setTrackingErrand] = useState(null);
  const [erranderPosition, setErranderPosition] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard'); // New state for tab-based navigation
  const navigate = useNavigate();
  const [totalSpent, setTotalSpent] = useState(0)

  // Load Google Maps script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const profileResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/erranderdashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const profileData = profileResponse.data?.profile || {};
        setProfile(profileData);

        if (profileData.slug) {
          const clicksResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/profile/get-clicks/${profileData.slug}`
          );
          setClicks(clicksResponse.data.clicks || 0);
        }

        const bookingsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/errand/history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings(bookingsResponse.data.history || []);

        const totalSpentResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/errand/total-spent`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalSpent(totalSpentResponse.data.totalSpent || 0);
  
      

        toast.success('You are welcome back', {
          style: { background: '#4CAF50', color: 'white' },
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('An error occurred while fetching dashboard data', {
          style: { background: '#F44', color: 'white' },
        });
        if (error.response?.status === 401 || error.response?.status === 404) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }

    
 
    };

    fetchData();
  }, [navigate]);


  


  // Socket.IO listeners for real-time updates
  useEffect(() => {
    if (profile?.userId?._id) {
      socket.emit('join', profile.userId._id);

      socket.on('errandUpdate', (errand) => {
        if (errand.clientId._id === profile.userId._id) {
          setBookings((prev) =>
            prev.map((e) => (e._id === errand._id ? errand : e))
          );
          if (errand.status === 'in_progress') {
            setTrackingErrand(errand);
          } else if (errand.status === 'completed') {
            setTrackingErrand(null);
            setErranderPosition(null);
          }
          toast.info(`Your errand status updated: ${errand.status}`);
        }
      });

      socket.on('notification', (notification) => {
        toast.info(notification.message);
      });

      socket.on('erranderLocation', ({ errandId, position }) => {
        if (trackingErrand && trackingErrand._id === errandId) {
          setErranderPosition(position);
        }
      });

      return () => {
        socket.off('errandUpdate');
        socket.off('notification');
        socket.off('erranderLocation');
      };
    }
  }, [profile, trackingErrand]);

  const totalBookings = bookings.length || 0;
  const totalViews = clicks || 0;

  const maxBookings = 100;
  const maxViews = 1000;
  const bookingsPercentage = totalBookings > 0 ? Math.round((totalBookings / maxBookings) * 100) : 0;
  const viewsPercentage = totalViews > 0 ? Math.round((totalViews / maxViews) * 100) : 0;

  const bookingsData = {
    labels: ['Bookings'],
    datasets: [
      {
        data: [bookingsPercentage, 100 - bookingsPercentage],
        backgroundColor: ['#4A90E2', '#E5E7EB'],
        borderWidth: 0,
      },
    ],
  };

  const viewsData = {
    labels: ['Views'],
    datasets: [
      {
        data: [viewsPercentage, 100 - viewsPercentage],
        backgroundColor: ['#4A90E2', '#E5E7EB'],
        borderWidth: 0,
      },
    ],
  };

  const userBookings = bookings.filter(booking => booking.clientId._id === profile.userId?._id);
  const totalUserBookings = userBookings.length;

  const acceptedBookings = userBookings.filter(booking => booking.status === 'accepted' || booking.status === 'in_progress').length;
  const canceledBookings = userBookings.filter(booking => booking.status === 'canceled').length;
  const completedBookings = userBookings.filter(booking => booking.status === 'completed').length;

  const totalOtherCategories = acceptedBookings + canceledBookings + completedBookings;
  const normalizedAcceptedPercentage = totalOtherCategories > 0 ? Math.round((acceptedBookings / totalOtherCategories) * 100) : 0;
  const normalizedCanceledPercentage = totalOtherCategories > 0 ? Math.round((canceledBookings / totalOtherCategories) * 100) : 0;
  const normalizedCompletedPercentage = totalOtherCategories > 0 ? Math.round((completedBookings / totalOtherCategories) * 100) : 0;
  const normalizedTotalBookingsPercentage = totalUserBookings;

  const errandsData = {
    labels: ['Accepted by Erranders', 'Total Bookings Made', 'Canceled Bookings', 'Completed Bookings'],
    datasets: [
      {
        data: [
          normalizedAcceptedPercentage,
          normalizedTotalBookingsPercentage,
          normalizedCanceledPercentage,
          normalizedCompletedPercentage,
        ],
        backgroundColor: ['#4A90E2', '#50C878', '#FF6B6B', '#F5E050'],
        borderWidth: 0,
      },
    ],
  };

  const acceptedBookingsWithErranders = userBookings.filter(booking => booking.status === 'accepted' || booking.status === 'in_progress');
  const uniqueErranders = [...new Set(acceptedBookingsWithErranders.map(booking => booking.erranderId._id))]
    .map(id => acceptedBookingsWithErranders.find(booking => booking.erranderId._id === id).errander);

  const todayReportData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: 'Marketing',
        data: [15, 10, 20, 5],
        backgroundColor: '#4A90E2',
        borderRadius: 5,
      },
      {
        label: 'Design',
        data: [10, 15, 5, 20],
        backgroundColor: '#F5E050',
        borderRadius: 5,
      },
    ],
  };

  const renderMainContent = () => {
    return (
      <div className="flex-1 p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              className="lg:hidden mr-4 text-gray-600"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FaBars size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">{activeTab}</h2>
          </div>
        </div>

        {activeTab === 'Dashboard' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="p-4 bg-green-100 rounded-lg mr-4">
                  <FaUser className="text-green-600 text-2xl" />
                </div>
                <div>
                  <p className="text-gray-600">Erranders</p>
                  <p className="text-2xl font-bold text-gray-800">{uniqueErranders.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="p-4 bg-blue-100 rounded-lg mr-4">
                  <FaHotel className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <p className="text-gray-600">Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">{bookingsPercentage}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="p-4 bg-red-100 rounded-lg mr-4">
                  <FaChartBar className="text-red-600 text-2xl" />
                </div>
                <div>
                  <p className="text-gray-600">Earnings</p>
                  <p className="text-2xl font-bold text-gray-800">N {totalSpent}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-gray-600 mb-2">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-800">{totalBookings}</p>
                    <p className="text-gray-600">{bookingsPercentage}%</p>
                    <div className="mt-4 w-16 h-16">
                      <Doughnut
                        data={bookingsData}
                        options={{
                          cutout: '70%',
                          plugins: { legend: { display: false } },
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-gray-600 mb-2">Total Views</p>
                    <p className="text-2xl font-bold text-gray-800">{totalViews}</p>
                    <p className="text-gray-600">{viewsPercentage}%</p>
                    <div className="mt-4 w-16 h-16">
                      <Doughnut
                        data={viewsData}
                        options={{
                          cutout: '70%',
                          plugins: { legend: { display: false } },
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Today Report</h3>
                    <span className="text-red-500 font-semibold">6,230 $</span>
                  </div>
                  <div className="h-64">
                    <Bar
                      data={todayReportData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value) => `${value}k $`,
                            },
                          },
                        },
                        plugins: {
                          legend: { display: false },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Erranders</h3>
                    <span className="text-red-500 font-semibold">{uniqueErranders.length}</span>
                  </div>
                  <div className="flex space-x-2">
                    {uniqueErranders.length > 0 ? (
                      uniqueErranders.slice(0, 5).map((errander, i) => (
                        <img
                          key={i}
                          src={errander.profilePicture || `https://randomuser.me/api/portraits/men/${i + 1}.jpg`}
                          alt="Errander"
                          className="w-10 h-10 rounded-full"
                        />
                      ))
                    ) : (
                      <p className="text-gray-600">No erranders have accepted your bookings yet.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Errands Breakdowns</h3>
                  <div className="relative w-40 h-40 mx-auto">
                    <Doughnut
                      data={errandsData}
                      options={{
                        cutout: '70%',
                        plugins: {
                          legend: { display: false },
                        },
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-800">{normalizedAcceptedPercentage}%</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Accepted by Erranders: {normalizedAcceptedPercentage}%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Total Bookings Made: {normalizedTotalBookingsPercentage}%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Canceled Bookings: {normalizedCanceledPercentage}%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
                      <span className="text-gray-600">Completed Bookings: {normalizedCompletedPercentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Modal for Client */}
            {trackingErrand && isLoaded && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Tracking Your Errand</h3>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '400px' }}
                    center={erranderPosition || (trackingErrand.pickupCoords || { lat: 6.5244, lng: 3.3792 })}
                    zoom={10}
                  >
                    {erranderPosition && <Marker position={erranderPosition} label="Errander" />}
                    {trackingErrand.pickupCoords && (
                      <Marker
                        position={trackingErrand.pickupCoords}
                        label="Pickup"
                        icon={{
                          url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                        }}
                      />
                    )}
                    {trackingErrand.destinationCoords && (
                      <Marker
                        position={trackingErrand.destinationCoords}
                        label="Destination"
                        icon={{
                          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        }}
                      />
                    )}
                  </GoogleMap>
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                      onClick={() => {
                        setTrackingErrand(null);
                        setErranderPosition(null);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'Erranders' && <ErrandersInDashboard/>} {/* Placeholder for Erranders */}
        {activeTab === 'Profile' && <ProfileUser />}
        {activeTab === 'TelephoneHistory' && <TelephoneHistory />}
        {activeTab === 'Statistics' && <div>Statistics Content</div>} {/* Placeholder for Statistics */}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100 font-sans">
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 lg:static lg:w-1/5 p-6 flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center mb-8">
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
                  <button
                    onClick={() => {
                      setActiveTab('Dashboard');
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center w-full text-left ${
                      activeTab === 'Dashboard'
                        ? 'text-gray-800 font-semibold'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FaChartBar className="mr-3 text-gray-500" /> Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('Erranders');
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center w-full text-left ${
                      activeTab === 'Erranders'
                        ? 'text-gray-800 font-semibold'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FaChartBar className="mr-3 text-gray-500" /> Erranders
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('Profile');
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center w-full text-left ${
                      activeTab === 'Profile'
                        ? 'text-gray-800 font-semibold'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FaHotel className="mr-3 text-gray-500" /> Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('TelephoneHistory');
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center w-full text-left ${
                      activeTab === 'TelephoneHistory'
                        ? 'text-gray-800 font-semibold'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FaCar className="mr-3 text-gray-500" /> Telephone History
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('Statistics');
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center w-full text-left ${
                      activeTab === 'Statistics'
                        ? 'text-gray-800 font-semibold'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FaPlane className="mr-3 text-gray-500" /> Statistics
                  </button>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="flex items-center text-red-600 hover:text-gray-800"
                  >
                    <FaUser className="mr-3 text-gray-500" /> Logout
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

        {renderMainContent()}
      </div>
    </>
  );
}

export default DashboardUser;