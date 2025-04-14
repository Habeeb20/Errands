// import { useEffect, useState } from 'react';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
// import { Doughnut, Bar } from 'react-chartjs-2';
// import { FaBars, FaChartBar, FaHotel, FaCar, FaPlane, FaUser, FaCog } from 'react-icons/fa';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import Navbar from '../../components/Navbar';
// import Profile from './Profile'; 

// // Register Chart.js components
// ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// function ErrandDashboard() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [profile, setProfile] = useState({});
//   const navigate = useNavigate();
//   const location = useLocation(); // Get the current route

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
//         console.log(response.data);
//         setProfile(response.data?.profile || {});
//         toast.success('You are welcome back', {
//           style: { background: '#4CAF50', color: 'white' },
//         });
//       } catch (error) {
//         console.error('Error fetching admin data:', error);
//         toast.error('An error occurred while fetching dashboard data', {
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

//   // Data for Spend Breakdowns (Donut Chart)
//   const spendBreakdownData = {
//     labels: ['Marketing', 'Design', 'Sales', 'Webflow'],
//     datasets: [
//       {
//         data: [50, 20, 20, 10], // Percentages
//         backgroundColor: ['#4A90E2', '#F5E050', '#FF6B6B', '#50C878'],
//         borderWidth: 0,
//       },
//     ],
//   };

//   // Data for Errands Metrics (Donut Chart)
//   const errandsData = {
//     labels: ['Errands Delivered', 'Positive Rating', 'Negative Rating', 'Available Errands'],
//     datasets: [
//       {
//         data: [43, 30, 15, 12], // Example percentages
//         backgroundColor: ['#4A90E2', '#50C878', '#FF6B6B', '#F5E050'],
//         borderWidth: 0,
//       },
//     ],
//   };

//   // Data for Today Report (Bar Chart)
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

//   // Conditionally render content based on the route
//   const renderMainContent = () => {
//     if (location.pathname === '/profile') {
//       return <Profile />;
//     }

//     return (
//       <div className="flex-1 p-6 lg:p-8">
//         {/* Header */}
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

//         {/* Metrics Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//           <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
//             <div className="p-4 bg-green-100 rounded-lg mr-4">
//               <FaUser className="text-green-600 text-2xl" />
//             </div>
//             <div>
//               <p className="text-gray-600">Travelers</p>
//               <p className="text-2xl font-bold text-gray-800">1,251</p>
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
//             <div className="p-4 bg-blue-100 rounded-lg mr-4">
//               <FaHotel className="text-blue-600 text-2xl" />
//             </div>
//             <div>
//               <p className="text-gray-600">Bookings</p>
//               <p className="text-2xl font-bold text-gray-800">2,870</p>
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

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Section */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Total Spend Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               <div className="bg-white p-6 rounded-xl shadow-md">
//                 <p className="text-gray-600 mb-2">Travelers</p>
//                 <p className="text-2xl font-bold text-gray-800">325,975 $</p>
//                 <p className="text-gray-600">Total Ext Spend</p>
//                 <div className="mt-4 w-16 h-16">
//                   <Doughnut
//                     data={{
//                       labels: ['Spent'],
//                       datasets: [
//                         {
//                           data: [80, 20],
//                           backgroundColor: ['#4A90E2', '#E5E7EB'],
//                           borderWidth: 0,
//                         },
//                       ],
//                     }}
//                     options={{
//                       cutout: '70%',
//                       plugins: { legend: { display: false } },
//                     }}
//                   />
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-xl shadow-md">
//                 <p className="text-gray-600 mb-2">Total Spend</p>
//                 <p className="text-2xl font-bold text-gray-800">3,02,754 $</p>
//                 <p className="text-gray-600">59%</p>
//                 <div className="mt-4 w-16 h-16">
//                   <Doughnut
//                     data={{
//                       labels: ['Spent'],
//                       datasets: [
//                         {
//                           data: [59, 41],
//                           backgroundColor: ['#4A90E2', '#E5E7EB'],
//                           borderWidth: 0,
//                         },
//                       ],
//                     }}
//                     options={{
//                       cutout: '70%',
//                       plugins: { legend: { display: false } },
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Today Report */}
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

//           {/* Right Section */}
//           <div className="space-y-6">
//             {/* Current Traveler */}
//             <div className="bg-white p-6 rounded-xl shadow-md">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Current Traveler</h3>
//                 <span className="text-red-500 font-semibold">6,230 $</span>
//               </div>
//               <div className="flex space-x-2">
//                 {[...Array(5)].map((_, i) => (
//                   <img
//                     key={i}
//                     src={`https://randomuser.me/api/portraits/men/${i + 1}.jpg`}
//                     alt="Traveler"
//                     className="w-10 h-10 rounded-full"
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Spend Breakdowns */}
//             <div className="bg-white p-6 rounded-xl shadow-md">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Spend Breakdowns</h3>
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
//                   <span className="text-2xl font-bold text-gray-800">43%</span>
//                 </div>
//               </div>
//               <div className="mt-4 space-y-2">
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
//                   <span className="text-gray-600">Errands Delivered: 43%</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
//                   <span className="text-gray-600">Positive Rating: 30%</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
//                   <span className="text-gray-600">Negative Rating: 15%</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
//                   <span className="text-gray-600">Available Errands: 12%</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="flex min-h-screen bg-gray-100 font-sans">
//         {/* Sidebar */}
//         <div
//           className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
//             isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 lg:static lg:w-1/5 p-6 flex flex-col justify-between`}
//         >
//           <div>
//             <div className="flex items-center mb-8">
//               <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-md mr-2"></div>
//               <h1 className="text-xl font-bold text-gray-800">E_Errands</h1>
//             </div>
//             <nav>
//               <ul className="space-y-4">
//                 <li>
//                   <Link
//                     to="#"
//                     className={`flex items-center ${
//                       location.pathname === '/dashboard' ? 'text-gray-800 font-semibold' : 'text-gray-600 hover:text-gray-800'
//                     }`}
//                   >
//                     <FaChartBar className="mr-3 text-gray-500" /> Dashboard
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="#"
//                     className="flex items-center text-gray-600 hover:text-gray-800"
//                   >
//                     <FaChartBar className="mr-3 text-gray-500" /> Errands
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
//                     to="#"
//                     className="flex items-center text-gray-600 hover:text-gray-800"
//                   >
//                     <FaCar className="mr-3 text-gray-500" /> Reports
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
//                     to="#"
//                     className="flex items-center text-gray-600 hover:text-gray-800"
//                   >
//                     <FaUser className="mr-3 text-gray-500" /> Details
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
//               <p className="text-gray-800 font-semibold">{profile?.userId?.firstName} {profile?.userId?.lastName}</p>
//               <Link to="#" className="text-gray-600 text-sm hover:underline">
//                 Visit site
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         {renderMainContent()}
//       </div>
//     </>
//   );
// }

// export default ErrandDashboard;






import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { FaBars, FaChartBar, FaHotel, FaCar, FaPlane, FaUser, FaCog } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Profile from './Profile';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function ErrandDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const [clicks, setClicks] = useState(0); // State for clicks (views)
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch profile data (including comments)
        const profileResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/erranderdashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const profileData = profileResponse.data?.profile || {};
        setProfile(profileData);

        // Fetch clicks (views) data
        if (profileData.slug) {
          const clicksResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/profile/get-clicks/${profileData.slug}`
          );
          setClicks(clicksResponse.data.clicks || 0);
        }

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

  // Calculate statistics for comments and views
  const totalComments = profile.comments?.length || 0;
  const totalViews = clicks || 0;

  // For simplicity, let's assume a baseline total for calculating percentages
  const maxComments = 100; // Arbitrary max for comments to calculate percentage
  const maxViews = 1000;   // Arbitrary max for views to calculate percentage
  const commentsPercentage = totalComments > 0 ? Math.round((totalComments / maxComments) * 100) : 0;
  const viewsPercentage = totalViews > 0 ? Math.round((totalViews / maxViews) * 100) : 0;

  // Data for Comments Doughnut Chart
  const commentsData = {
    labels: ['Comments'],
    datasets: [
      {
        data: [commentsPercentage, 100 - commentsPercentage],
        backgroundColor: ['#4A90E2', '#E5E7EB'],
        borderWidth: 0,
      },
    ],
  };

  // Data for Views Doughnut Chart
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

  // Data for Errands Metrics (Donut Chart)
  const errandsData = {
    labels: ['Errands Delivered', 'Positive Rating', 'Negative Rating', 'Available Errands'],
    datasets: [
      {
        data: [43, 30, 15, 12], // Example percentages
        backgroundColor: ['#4A90E2', '#50C878', '#FF6B6B', '#F5E050'],
        borderWidth: 0,
      },
    ],
  };

  // Data for Today Report (Bar Chart)
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

  // Conditionally render content based on the route
  const renderMainContent = () => {
    if (location.pathname === '/profile') {
      return <Profile />;
    }

    return (
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
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="p-4 bg-green-100 rounded-lg mr-4">
              <FaUser className="text-green-600 text-2xl" />
            </div>
            <div>
              <p className="text-gray-600">Travelers</p>
              <p className="text-2xl font-bold text-gray-800">1,251</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="p-4 bg-blue-100 rounded-lg mr-4">
              <FaHotel className="text-blue-600 text-2xl" />
            </div>
            <div>
              <p className="text-gray-600">Bookings</p>
              <p className="text-2xl font-bold text-gray-800">2,870</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="p-4 bg-red-100 rounded-lg mr-4">
              <FaChartBar className="text-red-600 text-2xl" />
            </div>
            <div>
              <p className="text-gray-600">Earnings</p>
              <p className="text-2xl font-bold text-gray-800">95,540 $</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Comments and Views Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <p className="text-gray-600 mb-2">Total Comments</p>
                <p className="text-2xl font-bold text-gray-800">{totalComments}</p>
                <p className="text-gray-600">{commentsPercentage}%</p>
                <div className="mt-4 w-16 h-16">
                  <Doughnut
                    data={commentsData}
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

            {/* Today Report */}
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

          {/* Right Section */}
          <div className="space-y-6">
            {/* Current Traveler */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Current Traveler</h3>
                <span className="text-red-500 font-semibold">6,230 $</span>
              </div>
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/men/${i + 1}.jpg`}
                    alt="Traveler"
                    className="w-10 h-10 rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Spend Breakdowns */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Spend Breakdowns</h3>
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
                  <span className="text-2xl font-bold text-gray-800">43%</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Errands Delivered: 43%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Positive Rating: 30%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Negative Rating: 15%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
                  <span className="text-gray-600">Available Errands: 12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100 font-sans">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 lg:static lg:w-1/5 p-6 flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-md mr-2"></div>
              <h1 className="text-xl font-bold text-gray-800">E_Errands</h1>
            </div>
            <nav>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/dashboard"
                    className={`flex items-center ${
                      location.pathname === '/dashboard' ? 'text-gray-800 font-semibold' : 'text-gray-600 hover:text-gray-800'
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
                    <FaChartBar className="mr-3 text-gray-500" /> Errands
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className={`flex items-center ${
                      location.pathname === '/profile' ? 'text-gray-800 font-semibold' : 'text-gray-600 hover:text-gray-800'
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
                    to="#"
                    className="flex items-center text-gray-600 hover:text-gray-800"
                  >
                    <FaUser className="mr-3 text-gray-500" /> Details
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
              <p className="text-gray-800 font-semibold">{profile?.userId?.firstName} {profile?.userId?.lastName}</p>
              <Link to="#" className="text-gray-600 text-sm hover:underline">
                Visit site
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {renderMainContent()}
      </div>
    </>
  );
}

export default ErrandDashboard;