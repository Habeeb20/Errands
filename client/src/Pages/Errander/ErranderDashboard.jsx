import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { FaBars, FaChartBar, FaHotel, FaCar, FaPlane, FaUser, FaCog } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Profile from './Profile';
import io from 'socket.io-client';
import { FaTimes } from 'react-icons/fa';
import TelephoneErrands from './TelephoneErrands';
import MyErrander from './MyErrander';

const socket = io(import.meta.env.VITE_BACKEND_URL);

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function ErrandDashboard() {
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const [clicks, setClicks] = useState(0); // State for clicks (views)
  const navigate = useNavigate();
  const [history, setHistory] = useState([]); // Store errand history
  const [notifications, setNotifications] = useState([]);
  const [trackingErrand, setTrackingErrand] = useState(null);
  const [accepted, setAccepted] = useState(null);
  const [totalEarning, setTotalEarning] = useState([]);
  const [completed, SetCompleted] = useState([]);
  const [tenPercent, setTenPercent] = useState([]);
  const [income, setIncome] = useState([]);
  const [activeTab, setActiveTab] = useState('Dashboard'); // New state for tab-based navigation

  const [bookings, setBookings] = useState([]); 
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

  const token = localStorage.getItem("token");

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

  ///fetch earnings
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/errand/total-earnings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotalEarning(response.data.totalEarnings);
        SetCompleted(response.data.completedErrandsCount);
        setTenPercent(response.data.platformFee);
        setIncome(response.data.income);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEarnings();
  }, [token]);

  // Handle accepting an errand
  const acceptedErrands = bookings.filter(
    booking => booking.status === 'accepted' || booking.status === 'in_progress'
  );

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

  // Calculate percentages for errands based on bookings
  const totalBookings = bookings.length || 0;
  const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;
  const rejectedBookings = bookings.filter(booking => booking.status === 'rejected').length;
  const acceptedBookings = bookings.filter(booking => booking.status === 'accepted' || booking.status === 'in_progress').length;
  const completedBookings = bookings.filter(booking => booking.status === 'completed').length;

  const pendingPercentage = totalBookings > 0 ? Math.round((pendingBookings / totalBookings) * 100) : 0;
  const rejectedPercentage = totalBookings > 0 ? Math.round((rejectedBookings / totalBookings) * 100) : 0;
  const acceptedPercentage = totalBookings > 0 ? Math.round((acceptedBookings / totalBookings) * 100) : 0;
  const completedPercentage = totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;

  // Data for Errands Metrics (Donut Chart)
  const errandsData = {
    labels: ['Completed Bookings', 'Accepted Bookings', 'Rejected Bookings', 'Pending Bookings'],
    datasets: [
      {
        data: [completedPercentage, acceptedPercentage, rejectedPercentage, pendingPercentage],
        backgroundColor: ['#4A90E2', '#50C878', '#FF6B6B', '#F5E050'], // Blue, Green, Red, Yellow
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

  // Conditionally render content based on activeTab
  const renderMainContent = () => {
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
            <h2 className="text-2xl font-bold text-gray-800">{activeTab}</h2>
          </div>
        </div>

        {activeTab === 'Dashboard' && (
          <div>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="p-4 bg-green-100 rounded-lg mr-4">
                  <FaUser className="text-green-600 text-2xl" />
                </div>
                <div>
                  <p className="text-gray-600">Clients</p>
                  <p className="text-2xl font-bold text-gray-800">1</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="p-4 bg-green-100 rounded-lg mr-4">
                  <FaHotel className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <p className="text-gray-600">Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="p-4 bg-blue-100 rounded-lg mr-4">
                  <FaHotel className="text-yellow-600 text-2xl" />
                </div>
                <div>
                  <p className="text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-800"><span className='font-bold text-black pr-2'>N</span>{totalEarning}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="p-4 bg-red-100 rounded-lg mr-4">
                  <FaChartBar className="text-red-600 text-2xl" />
                </div>
                <div>
                  <p className="text-green-600 mt-4 font-bold">platForm deduction </p>
                  <p className="text-2xl font-bold text-gray-800"><span className='font-bold text-black pr-2'>N</span>{tenPercent}</p>
                  <p className="text-green-600 mt-4 font-bold"> Income</p>
                  <p className="text-2xl font-bold text-gray-800"><span className='font-bold text-black pr-2'>N</span>{income}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="p-4 bg-red-100 rounded-lg mr-4">
                  <FaChartBar className="text-red-600 text-2xl" />
                </div>
                <div>
                  <p className="text-green-600 mt-4 font-bold">Completed Errands</p>
                  <p className="text-2xl font-bold text-gray-800">{completed}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="p-4 bg-red-100 rounded-lg mr-4">
                  <FaChartBar className="text-red-600 text-2xl" />
                </div>
                <div>
                  <p className="text-green-600 mt-4 font-bold">platform fee</p>
                  <p className="text-2xl font-bold text-gray-800">10%</p>
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
                  segments
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
                    <h3 className="text-lg font-semibold text-gray-800">Cilents</h3>
                    <span className="text-red-500 font-semibold">{bookings.length}</span>
                  </div>
                  <div className="flex space-x-2">
                    {acceptedErrands.length > 0 ? (
                      acceptedErrands.map((accept) => (
                        <img
                          key={accept._id}
                          src={accept.client?.profilePicture || 'https://randomuser.me/api/portraits/women/44.jpg'} 
                          alt={`${accept.client?.firstName || 'Traveler'} ${accept.client?.lastName || ''}`} 
                          className="w-10 h-10 rounded-full"
                        />
                      ))
                    ) : (
                      <p className="text-gray-600">No clients yet</p> 
                    )}
                  </div>
                </div>

                {/* Spend Breakdowns */}
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
                      <span className="text-2xl font-bold text-gray-800">{completedPercentage}%</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Completed Bookings: {completedPercentage}%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Accepted Bookings: {acceptedPercentage}%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Rejected Bookings: {rejectedPercentage}%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
                      <span className="text-gray-600">Pending Bookings: {pendingPercentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'MyErrands' && <MyErrander/>} {/* Placeholder for MyErrands */}
        {activeTab === 'Profile' && <Profile />}
        {activeTab === 'TelephoneErrands' && <TelephoneErrands />}
        {activeTab === 'Statistics' && <div>Statistics Content</div>} {/* Placeholder for Statistics */}
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
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-md mr-2"></div>
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
                      setActiveTab('MyErrands');
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center w-full text-left ${
                      activeTab === 'MyErrands'
                        ? 'text-gray-800 font-semibold'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FaChartBar className="mr-3 text-gray-500" /> MyErrands
                    <span className='bg-red-500 rounded-full text-white p-1 space-x-2 font-sm'>{notifications.length}</span>
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
                      setActiveTab('TelephoneErrands');
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center w-full text-left ${
                      activeTab === 'TelephoneErrands'
                        ? 'text-gray-800 font-semibold'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FaCar className="mr-3 text-gray-500" /> Telephone errands
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