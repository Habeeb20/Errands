// components/Sidebar.jsx
import { FaBars, FaChartBar, FaHotel, FaCar, FaPlane, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Sidebar({ isSidebarOpen, setIsSidebarOpen, profile, location }) {
  return (
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
  );
}

export default Sidebar;