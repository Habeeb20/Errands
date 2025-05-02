import React, { useState, useEffect } from 'react';

const MessengerStats = () => {
  const [stateStats, setStateStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [messengers, setMessengers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Fetch state stats
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/messengers/stats`);
        const data = await response.json();
        if (response.ok) {
          setStateStats(data);
        } else {
          setError(data.message || 'Failed to fetch stats');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  // Fetch messengers for the selected state
  const fetchMessengers = async (state) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/allmessengers?state=${encodeURIComponent(state)}`
      );
      const data = await response.json();
      if (response.ok) {
        setMessengers(data);
      } else {
        setModalError(data.message || 'Failed to fetch messengers');
      }
    } catch (err) {
      setModalError('Network error. Please try again.');
    }
    setModalLoading(false);
  };

  // Handle state click to open modal
  const handleStateClick = (state) => {
    setSelectedState(state);
    fetchMessengers(state);
  };

  // Close modal
  const closeModal = () => {
    setSelectedState(null);
    setMessengers([]);
    setModalError(null);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          We have over 1M messengers around Nigeria... so there’s one beside you
        </h2>

        {/* State Tags */}
        {loading ? (
          <p className="text-gray-600">Loading stats...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            {stateStats.map((state) => (
              <button
                key={state.name}
                onClick={() => handleStateClick(state.name)}
                className="bg-green-100 text-gray-800 text-sm sm:text-base font-medium px-4 py-2 rounded-full hover:bg-green-200 transition-colors"
              >
                {state.name} ({state.count})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-green-50 p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl sm:text-2xl font-semibold text-green-700">
                Messengers in {selectedState}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-600"></div>
                </div>
              ) : modalError ? (
                <p className="text-red-600 text-center">{modalError}</p>
              ) : messengers.length === 0 ? (
                <p className="text-gray-600 text-center">
                  No messengers found in {selectedState}.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {messengers.map((profile) => (
                    <ProfileCard key={profile._id} profile={profile} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ProfileCard Component (similar to Messenger1.jsx)
const ProfileCard = ({ profile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      {profile.profilePicture && (
        <img
          src={profile.profilePicture}
          alt={`${profile.name}'s profile`}
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
      )}
      <h2 className="text-xl font-semibold text-gray-800 mb-3">{profile.name || 'Unknown'}</h2>
      <p className="text-gray-600 mb-1">State: {profile.state || 'N/A'}</p>
      <p className="text-gray-600 mb-1">LGA: {profile.lga || 'N/A'}</p>
      {isExpanded && (
        <div className="mt-4 space-y-2 animate-fade-in">
          <p className="text-gray-600">Email: {profile.email || 'N/A'}</p>
          <p className="text-gray-600">Phone: {profile.phone || 'N/A'}</p>
          <p className="text-gray-600">Age: {profile.age || 'N/A'}</p>
          <p className="text-gray-600">Gender: {profile.gender || 'N/A'}</p>
          <p className="text-gray-600">Verification: {profile.verificationStatus || 'N/A'}</p>
          <p className="text-gray-600">Unique ID: {profile.uniqueNumber || 'N/A'}</p>
          {profile.comments && profile.comments.length > 0 && (
            <p className="text-gray-600">Comments: {profile.comments.join(', ')}</p>
          )}
        </div>
      )}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
      >
        {isExpanded ? 'View Less' : 'View More'}
      </button>
    </div>
  );
};

export default MessengerStats;