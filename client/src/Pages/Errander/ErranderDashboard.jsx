import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { FaBars, FaChartBar, FaHotel, FaCar, FaPlane, FaUser, FaCog } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function ErrandDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data for Spend Breakdowns (Donut Chart)
  const spendBreakdownData = {
    labels: ['Marketing', 'Design', 'Sales', 'Webflow'],
    datasets: [
      {
        data: [50, 20, 20, 10], // Percentages
        backgroundColor: ['#4A90E2', '#F5E050', '#FF6B6B', '#50C878'],
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

  return (
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
            <h1 className="text-xl font-bold text-gray-800">TRIPLER</h1>
          </div>
          <nav>
            <ul className="space-y-4">
              <li>
                <a href="#" className="flex items-center text-gray-800 font-semibold">
                  <FaChartBar className="mr-3 text-gray-500" /> Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-600 hover:text-gray-800">
                  <FaChartBar className="mr-3 text-gray-500" /> Report
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-600 hover:text-gray-800">
                  <FaHotel className="mr-3 text-gray-500" /> Hotels
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-600 hover:text-gray-800">
                  <FaCar className="mr-3 text-gray-500" /> Car
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-600 hover:text-gray-800">
                  <FaPlane className="mr-3 text-gray-500" /> Flight
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-600 hover:text-gray-800">
                  <FaUser className="mr-3 text-gray-500" /> Travelers
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="User"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="text-gray-800 font-semibold">Denica</p>
            <a href="#" className="text-gray-600 text-sm hover:underline">
              Visit site
            </a>
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
            {/* Total Spend Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <p className="text-gray-600 mb-2">Travelers</p>
                <p className="text-2xl font-bold text-gray-800">325,975 $</p>
                <p className="text-gray-600">Total Ext Spend</p>
                <div className="mt-4 w-16 h-16">
                  <Doughnut
                    data={{
                      labels: ['Spent'],
                      datasets: [
                        {
                          data: [80, 20],
                          backgroundColor: ['#4A90E2', '#E5E7EB'],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      cutout: '70%',
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <p className="text-gray-600 mb-2">Total Spend</p>
                <p className="text-2xl font-bold text-gray-800">3,02,754 $</p>
                <p className="text-gray-600">59%</p>
                <div className="mt-4 w-16 h-16">
                  <Doughnut
                    data={{
                      labels: ['Spent'],
                      datasets: [
                        {
                          data: [59, 41],
                          backgroundColor: ['#4A90E2', '#E5E7EB'],
                          borderWidth: 0,
                        },
                      ],
                    }}
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
    </div>
  );
}

export default ErrandDashboard;