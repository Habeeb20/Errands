import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, useInView } from 'framer-motion';
import { toast } from 'sonner';
import { FaShareAlt, FaBox, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import DistanceBadge from '../DistanceBadge';
import { Link } from 'react-router-dom';

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

const AllErrander = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareCounts, setShareCounts] = useState({});
  const [clickCounts, setClickCounts] = useState({}); 
  const [clicks, setClicks] = useState([])
  const [comments, setComments] = useState([])
  const [error,setError] = useState('')
  // Fetch all erranders
  useEffect(() => {
    const fetchAllErranders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/erranders`);
        toast.success('Erranders are available', {
          style: { background: 'white', color: 'black' },
        });
        setData(response.data.data || []);
     
        // Initialize share and click counts
        const initialShareCounts = {};
        const initialClickCounts = {};
        response.data.data.forEach((errander) => {
          initialShareCounts[errander.slug] = 0;
          initialClickCounts[errander.slug] = 0;
        });
        setShareCounts(initialShareCounts);
        setClickCounts(initialClickCounts);

    
      } catch (error) {
        console.log('Error fetching erranders:', error);
        toast.error('Error occurred while fetching erranders', {
          style: { background: 'white', color: 'black' },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAllErranders();
  }, []);

  // Fetch shares for each errander
  useEffect(() => {
    const fetchShares = async (slug) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/profile/${slug}/shares`);
        setShareCounts((prev) => ({
          ...prev,
          [slug]: response.data.shareCount || 0,
        }));
    
      } catch (error) {
        console.log(`Failed to fetch shares for ${slug}:`, error);
        toast.error(`Failed to fetch shares for ${slug}`, {
          style: { background: 'white', color: 'red' },
        });
      }
    };

    data.forEach((errander) => {
      if (errander.slug) fetchShares(errander.slug);
    });
  }, [data]);

  // Fetch clicks for each errander (assuming a per-profile clicks endpoint)
  useEffect(() => {
    const fetchClicks = async (slug) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/profile/get-clicks/${slug}`);
        setClickCounts((prev) => ({
          ...prev,
          [slug]: response.data.clicks || 0,
        }));
        console.log(response.data.clicks, "clicks")
        setClicks(response.data.clicks)
      } catch (error) {
        console.log(`Failed to fetch clicks for ${slug}:`, error);
        toast.error(`Failed to fetch clicks for ${slug}`, {
          style: { background: 'white', color: 'red' },
        });
      }
    };

    data.forEach((errander) => {
      if (errander.slug) fetchClicks(errander.slug);
    });
  }, [data]);


  // Post shares for a specific errander
  const handleShareClick = async (slug) => {
    try {
      setShareCounts((prev) => ({
        ...prev,
        [slug]: prev[slug] + 1,
      }));

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/profile/${slug}/shares`);
      if (response.data && response.data.shareCount) {
        setShareCounts((prev) => ({
          ...prev,
          [slug]: response.data.shareCount,
        }));
      }
    } catch (error) {
      console.error(`Failed to record share for ${slug}:`, error);
      setShareCounts((prev) => ({
        ...prev,
        [slug]: prev[slug] - 1,
      }));
      toast.error('Failed to record share. Please try again.', {
        style: { background: 'red', color: 'white' },
      });
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading erranders...</div>;
  }

  return (
    <div className=" bg-gray-100 p-6">
      <AnimatedSection>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Erranders</h2>
        {data && data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((dat, index) => (
              <div
                key={dat._id || index}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-4"
              >
                {/* Errander Details */}
                <div className="space-y-2">
                  <p className="text-gray-800 font-semibold">
                    Name:{' '}
                    <span className="font-normal">
                      {dat.userId?.firstName || 'James'} {dat.userId?.lastName || 'Johnson'}
                    </span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Age: <span className="font-normal">{dat.age || 'N/A'}</span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Gender: <span className="font-normal">{dat.gender || 'N/A'}</span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Location:{' '}
                    <span className="font-normal">
                      {dat.LGA || dat.userId?.lga || 'Unknown'}, {dat.state || 'Unknown'}
                    </span>
                  </p>
                  <p
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      dat.userId?.verificationStatus === 'verified'
                        ? 'text-green-800 bg-green-200'
                        : dat.userId?.verificationStatus === 'unverified'
                        ? 'text-red-800 bg-red-200'
                        : 'text-yellow-800 bg-yellow-200'
                    }`}
                  >
                    Verification Status:{' '}
                    <span className="font-normal">{dat.userId?.verificationStatus || 'Pending'}</span>
                  </p>
                  <Link to="/login">
                  <button
                        className='bg-green-400 p-2 rounded-md text-white ml-3'>
                            book

                        </button>
                        </Link>
                </div>

                {/* Distance Badge and View More Button */}
                <div className="flex flex-wrap gap-4">
                  <DistanceBadge dat={{ LGA: dat.userId?.lga || dat.lga || dat.LGA || 'Ikeja, Lagos' }} />
                  <Link to={`/profile/${dat.slug}`}>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                      onClick={async () => {
                        try {
                          await axios.post(
                            `${import.meta.env.VITE_BACKEND_URL}/api/profile/${dat.slug}/click`
                          );
                          setClickCounts((prev) => ({
                            ...prev,
                            [dat.slug]: prev[dat.slug] + 1,
                          }));
                          toast.success('Click counted', {
                            style: { background: 'white', color: 'black' },
                          });
                        } catch (error) {
                          console.error('Error incrementing click count:', error);
                          toast.error('Failed to record click', {
                            style: { background: 'white', color: 'red' },
                          });
                        }
                      }}
                    >
                      View More
                    </button>
                  </Link>
                </div>

                {/* Stats and Share */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <div className="flex items-center text-gray-600">
                      <FaBox className="mr-1 text-gray-500" />
                      <span>{comments.length}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaThumbsUp className="mr-1 text-green-500" />
                      <span>{clicks || 0}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaThumbsDown className="mr-1 text-red-500" />
                      <span>{dat.negative || 0}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleShareClick(dat.slug)}
                    className="flex items-center text-gray-600 hover:text-gray-800"
                  >
                    <FaShareAlt className="mr-1" />
                    <span>{shareCounts[dat.slug] || 0}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No erranders available at the moment.</p>
        )}
      </AnimatedSection>
    </div>
  );
};

export default AllErrander;









































