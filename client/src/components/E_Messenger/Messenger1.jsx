import { useState, useEffect } from 'react';
import { statesAndLgas } from '../../stateAndLga';
import Navbar from '../Navbar';
import Footer from '../Footer';

const Messenger = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Transform statesAndLgas object into an array of { name, lgas }
  const statesArray = Object.keys(statesAndLgas).map((stateName) => ({
    name: stateName,
    lgas: statesAndLgas[stateName],
  }));

  // Fetch profiles based on selected state
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = selectedState
          ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/allmessengersInState?state=${encodeURIComponent(selectedState)}`
          : `${import.meta.env.VITE_BACKEND_URL}/api/auth/allmessengersInState`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setProfiles(data);
        } else {
          setError(data.message || 'Failed to fetch profiles');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      }
      setLoading(false);
    };
    fetchProfiles();
  }, [selectedState]);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  return (
    <>
   
    <div className=" bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
   

      {/* Search Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-3">
            Search by State
          </label>
          <select
            id="state"
            value={selectedState}
            onChange={handleStateChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 bg-gray-50 text-gray-800"
            disabled={loading}
          >
            <option value="">All States</option>
            {statesArray.length > 0 ? (
              statesArray.map((state) => (
                <option key={state.name} value={state.name}>
                  {state.name}
                </option>
              ))
            ) : (
              <option disabled>No states available</option>
            )}
          </select>
        </div>

        {/* Profiles Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600"></div>
            <span className="ml-4 text-gray-600 text-lg">Loading profiles...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 font-semibold text-lg">{error}</p>
            <button
              onClick={() => fetchProfiles()}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {profiles.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 text-lg font-medium">
                No profiles found for the selected state.
              </p>
            ) : (
              profiles.map((profile) => (
                <ProfileCard key={profile._id} profile={profile} />
              ))
            )}
          </div>
        )}
      </main>
    </div>


    </>
   
  );
};

const ProfileCard = ({ profile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">{profile.name || 'Unknown'}</h2>
      <p className="text-gray-600 mb-1">State: {profile.state || 'N/A'}</p>
      <p className="text-gray-600 mb-1">LGA: {profile.lga || 'N/A'}</p>
      {isExpanded && (
        <div className="mt-4 space-y-2 animate-fade-in">
          <p className="text-gray-600">Email: {profile.email || 'N/A'}</p>
          <p className="text-gray-600">Phone: {profile.phone || 'N/A'}</p>
        </div>
      )}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
      >
        {isExpanded ? 'View Less' : 'View More'}
      </button>
    </div>
  );
};

export default Messenger;