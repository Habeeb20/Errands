import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { FaBars, FaChartBar, FaHotel, FaCar, FaPlane, FaUser } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

function ProfileUser() {
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

    profilePicture: '',
  
 
   
  });
  const [isEditing, setIsEditing] = useState(true); 
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 

  
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
 
      <div className="flex min-h-screen bg-gray-100 font-sans">

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
     

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
                <label className="block text-gray-600 mb-1">state</label>
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

export default ProfileUser;