import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { FaBars, FaChartBar, FaHotel, FaCar, FaPlane, FaUser } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

function Profile() {
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
  const [isEditing, setIsEditing] = useState(true); // Start in edit mode
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Added to track the current route for sidebar highlighting

  // Fetch the profile data on component mount
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle image upload to Cloudinary
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return profile.profilePicture;

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
      return profile.profilePicture;
    }
  };

  // Handle form submission to save changes
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Upload image if a new one was selected
      const profilePictureUrl = await uploadImageToCloudinary();

      const updatedProfile = {
        ...profile,
        profilePicture: profilePictureUrl,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`,
        updatedProfile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile(response.data.profile);
      setIsEditing(false);
      toast.success('Profile updated successfully', {
        style: { background: '#4CAF50', color: 'white' },
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile', {
        style: { background: '#F44', color: 'white' },
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100 font-sans">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg lg:w-1/5 p-6 flex flex-col justify-between">
  <div>
    <div className="flex items-center mb-8">
      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-md mr-2"></div>
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

          {/* Profile Form */}
          <div className="bg-white ml-45 p-6 rounded-xl shadow-md max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <img
                  src={profile.profilePicture || 'https://randomuser.me/api/portraits/women/44.jpg'}
                  alt="Profile"
                  className="w-16 h-16 rounded-full mr-4"
                />
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm text-gray-600"
                  />
                )}
              </div>
              <div>
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    >
                      Continue
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  value={`${profile.userId?.firstName || ''} ${profile.userId?.lastName || ''}`}
                  disabled
                  className="w-full p-2 border rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Age</label>
                <input
                  type="text"
                  name="age"
                  value={profile.age}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Sex</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  name="userEmail"
                  value={profile.userEmail}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Phone No.</label>
                <input
                  type="text"
                  name="referenceContact"
                  value={profile.referenceContact}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Driver's License</label>
                <input
                  type="text"
                  name="driverLicense"
                  value={profile.driverLicense}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Nationality</label>
                <input
                  type="text"
                  name="state"
                  value={profile.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Do you own a vehicle?</label>
                <div className="flex space-x-4">
                  <label>
                    <input
                      type="radio"
                      name="WDYD"
                      value="Yes"
                      checked={profile.WDYD === 'Yes'}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="WDYD"
                      value="No"
                      checked={profile.WDYD === 'No'}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    No
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={profile.maritalStatus}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select one</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profile.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">LGA</label>
                <input
                  type="text"
                  name="LGA"
                  value={profile.LGA}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">When and how strongly you smoke?</label>
                <select
                  name="alcoholUse"
                  value={profile.alcoholUse}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select one</option>
                  <option value="Never">Never</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Frequently">Frequently</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Height</label>
                <input
                  type="text"
                  name="height"
                  value={profile.height}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={profile.weight}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Medical Condition</label>
                <input
                  type="text"
                  name="medicalCondition"
                  value={profile.medicalCondition}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">NIN</label>
                <input
                  type="text"
                  name="NIN"
                  value={profile.NIN}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Reference Contact</label>
                <input
                  type="text"
                  name="referenceContact"
                  value={profile.referenceContact}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Reference Address</label>
                <input
                  type="text"
                  name="referenceAddress"
                  value={profile.referenceAddress}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Reference Occupation</label>
                <input
                  type="text"
                  name="referenceOccupation"
                  value={profile.referenceOccupation}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Number of Wives</label>
                <input
                  type="text"
                  name="numberOfWives"
                  value={profile.numberOfWives}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Address of Spouse</label>
                <input
                  type="text"
                  name="addressOfSpouse"
                  value={profile.addressOfSpouse}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Number of Children</label>
                <input
                  type="text"
                  name="numberOfChildren"
                  value={profile.numberOfChildren}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Display comments/reviews if available */}
            {profile.comments && profile.comments.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Reviews</h3>
                {profile.comments.map((comment, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-gray-800 font-semibold">{comment.name}</p>
                    <p className="text-gray-600">{comment.text}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;