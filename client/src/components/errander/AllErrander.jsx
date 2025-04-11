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
  // Fix: Correct useState syntax
  const [data, setData] = useState([]);
  const {clicks, setClicks} = useState(0)
  const {shares, setShares} = useState(0)
  const {comments, setComments} = useState(0)
  const {slug, setSlug} = useState("")

  useEffect(() => {
    const fetchAllErranders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/erranders`);
        toast.success('Erranders are available', {
          style: { background: 'white', color: 'black' },
        });
        setData(response.data.data);
        console.log(response.data)
        setSlug(response.data.data?.slug)
      } catch (error) {
        console.log(error);
        toast.error('Error occurred', {
          style: { background: 'white', color: 'black' },
        });
      }
    };
    fetchAllErranders();
  }, []);



  ///get clicks 

  useEffect(() => {
    const fetchClicks = async() => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/profile/get-clicks`);
            setClicks(response.data.profile.length)
            console.log(response.data.profile.length)
        } catch (error) {
            console.log(error)
        }
    }
    fetchClicks()
  }, [])


  ///get shares 


  useEffect(() => {
    const fetchShares = async() => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/profile/${slug}/shares`);
            setShares(response.data.shareCount || 0 )
            
            console.log(response.data.shareCount)
        } catch (error) {
            console.log("failed to fetch share",error)
        }
    }
    fetchShares()
  }, [slug])
  

  return (
    <div className=" bg-gray-100 p-6">
      <AnimatedSection>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Erranders</h2>
        {data && data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((dat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-4"
              >
                {/* Errander Details */}
                <div className="space-y-1">
                  <p className="text-gray-800 font-semibold">
                    Name: <span className="font-normal">{dat.userId?.firstName || 'James Johnson'} {dat.userId?.lastName || 'James Johnson'}</span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Age: <span className="font-normal">{dat.age }</span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Gender: <span className="font-normal">{dat.gender}</span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Location: <span className="font-normal">{dat.LGA }, {dat.state}</span>
                  </p>
                  <p className={`${
                    dat.userId?.verificationStatus === "verified" ? "text-green-400 bg-green-200 p-2 rounded-full" : dat.userId?.verificationStatus === "unverified" ? "text-red-white bg-red-400 p-2 rounded-full" : "text-black bg-yellow-300 p-2 rounded-full"
                  }`}>
                    verification-Status: <span className="font-normal">{dat.userId?.verificationStatus}</span>
                  </p>
                </div>

                  <div className='flex flex-wrap space-x-4 rounded-full '>
                  <DistanceBadge dat={{ LGA: dat.lga || dat.userId?.lga || dat.LGA }} />

                  <Link to={`/profile/${dat.slug}`}>
                  <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  onClick={async () => {
                    try {
                      await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/api/profile/${dat.slug}/click`
                      );
                      console.log("Click count incremented");
                      toast.success("click counted", {
                        style:{background: "white", color:"black"}
                      })
                    } catch (error) {
                      console.error("Error incrementing click count:", error);
                    }
                  }}
                >
                  view more
                </button>
                  </Link>

                  </div>
                {/* Distance Badge */}


                {/* Stats and Share */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <div className="flex items-center text-gray-600">
                      <FaBox className="mr-1 text-gray-500" />
                      <span>{dat.delivered || '324'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaThumbsUp className="mr-1 text-green-500" />
                      <span>{clicks || '123'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaThumbsDown className="mr-1 text-red-500" />
                      <span>{dat.negative || '123'}</span>
                    </div>
                  </div>
                  <button className="text-gray-600 hover:text-gray-800">
                    <FaShareAlt />
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










































