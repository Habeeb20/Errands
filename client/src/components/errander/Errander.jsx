import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, useInView } from 'framer-motion';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

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

const Errander = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [shareCount, setShareCount] = useState(0);

  useEffect(() => {
    if (!slug) {
      toast.error('Profile details not found', {
        style: { background: 'white', color: 'red' },
      });
      return;
    }

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/profile/aprofile/${slug}`)
      .then((response) => {
        setProfile(response.data.profile);
        console.log(response.data.profile, "your profile details")
        setComments(response.data.profile?.comments || []);
        setShareCount(response.data.profile?.shareCount || 0);
        setError(null);
      })
      .catch((error) => {
        console.log(error);
        toast.error('Failed to load profile, please try again later', {
          style: { background: 'white', color: 'red' },
        });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShareClick = async () => {
    try {
      setShareCount((prev) => prev + 1);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/profile/${slug}/shares`
      );
      console.log('Share recorded successfully:', response.data);

      if (response.data && response.data.shareCount) {
        setShareCount(response.data.shareCount);
      }
    } catch (error) {
      console.error('Failed to record share:', error);
      setShareCount((prev) => prev - 1);
      toast.error('Failed to record share. Please try again.', {
        style: { background: 'white', color: 'red' },
      });
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() === '' || userName.trim() === '') return;

    const comment = { name: userName, text: newComment };
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    setNewComment('');
    setUserName('');
    setShowModal(false);

    localStorage.setItem(
      `school_${slug}_comments`,
      JSON.stringify(updatedComments)
    );

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/profile/${slug}/comments`, comment)
      .then(() => {})
      .catch((error) => console.error('Failed to post comment:', error));
  };

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">{error}</div>;
  }

  if (!profile) {
    return <div className="text-center py-10">Profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <AnimatedSection>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <img
                src={profile.profilePicture || 'https://via.placeholder.com/100'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
              <div>
                <h1 className="text-2xl font-bold">
                  {profile.userId?.firstName} {profile.userId?.lastName}
                </h1>
                <p className="text-gray-600">
                  {profile?.lga || profile?.address || 'Location not provided'},   {profile?.state || 'Location not provided'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleShareClick}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Joined since 2023 ({shareCount})
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                Cancel
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                Continue
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Profile Details */}
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <p className="mt-1 p-2 bg-gray-100 rounded">{profile?.age || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">Sex</label>
                <p className="mt-1 p-2 bg-gray-100 rounded">{profile?.gender || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">Phone No.</label>
                <p className="mt-1 p-2 bg-gray-100 rounded">{profile?.phone || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">Do you own a vehicle?</label>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={profile?.hasVehicle === true}
                      readOnly
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={profile?.hasVehicle === false}
                      readOnly
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">Medical Condition</label>
                <p className="mt-1 p-2 bg-gray-100 rounded">{profile.medicalCondition || 'None'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">What can you drive?</label>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {profile.hobbies?.map((hobby, index) => (
                    <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                      {hobby}
                    </span>
                  )) || <p className="text-gray-500">N/A</p>}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 p-2 bg-gray-100 rounded">{profile.userId?.email || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">Nationality</label>
                <p className="mt-1 p-2 bg-gray-100 rounded">{profile.nationality || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="mt-1 p-2 bg-gray-100 rounded">{profile?.dateOfBirth || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                <p className="mt-1 p-2 bg-gray-100 rounded">{profile?.maritalStatus || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">Height</label>
                <p className="mt-1 p-2 bg-gray-100 rounded">{profile.height || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">Weight</label>
                <p className="mt-1 p-2 bg-gray-100 rounded">{profile.weight || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">Alcohol Consumption</label>
                <p className="mt-1 p-2 bg-gray-100 rounded">{profile.alcoholConsumption || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">Are you a smoker?</label>
                <p className="mt-1 p-2 bg-gray-100 rounded">{profile.smoker || 'N/A'}</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Reference Section */}
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700">Reference Contact</label>
              <p className="mt-1 p-2 bg-gray-100 rounded">{profile.referenceContact || 'N/A'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700">Reference Address</label>
              <p className="mt-1 p-2 bg-gray-100 rounded">{profile.referenceAddress || 'N/A'}</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Comments Section */}
        <AnimatedSection>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{comment.name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-blue-600 underline"
            >
              Add a review
            </button>
          </div>
        </AnimatedSection>
      </div>

      {/* Comment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add a Review</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Your Review</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                  rows="4"
                  placeholder="Type your review here"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddComment}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Errander;