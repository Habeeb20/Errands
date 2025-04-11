// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import axios from 'axios';

// const DistanceBadge = ({ dat }) => {
//   const [distance, setDistance] = useState(null);
//   const [error, setError] = useState(null);
//   const [retry, setRetry] = useState(false); // For retrying geolocation

//   // Haversine formula to calculate distance
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Earth's radius in km
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c;
//     return distance.toFixed(1);
//   };

//   const geocodeAddress = async (address) => {
//     try {
//       const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/geocode/json`,
//         {
//           params: {
//             address,
//             key: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
//           },
//         }
//       );
//       const { results } = response.data;
//       console.log(response.data)
//       if (results.length > 0) {
//         const { lat, lng } = results[0].geometry.location;
//         return { lat, lng };
//       }
//       throw new Error('No coordinates found for address');
//     } catch (err) {
//       console.error('Geocoding error:', err);
//       throw err;
//     }
//   };

//   const fetchDistance = async () => {
//     try {
//       // Get user's location
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const userLat = position.coords.latitude;
//           const userLng = position.coords.longitude;

//           let lgaLat, lgaLng;

//           // Check for lga (case-insensitive)
//           const lga = dat?.lga || dat?.LGA;
//           if (lga) {
//             if (typeof lga === 'object' && lga.lat && lga.lng) {
//               lgaLat = lga.lat;
//               lgaLng = lga.lng;
//             } else {
//               const coords = await geocodeAddress(lga);
//               lgaLat = coords.lat;
//               lgaLng = coords.lng;
//             }

//             const calculatedDistance = calculateDistance(
//               userLat,
//               userLng,
//               lgaLat,
//               lgaLng
//             );
//             setDistance(calculatedDistance);
//             setError(null); // Clear any previous error
//           } else {
//             setError('Location unavailable');
//           }
//         },
//         (geoError) => {
//           console.error('Geolocation error:', geoError);
//           setError(
//             geoError.code === 1
//               ? 'Please allow location access to calculate distance'
//               : 'Unable to get your location'
//           );
//         },
//         { enableHighAccuracy: true, timeout: 10000 }
//       );
//     } catch (err) {
//       setError('Failed to calculate distance');
//     }
//   };

//   useEffect(() => {
//     fetchDistance();
//   }, [dat?.lga, dat?.LGA, retry]); // Re-run on lga change or retry

//   return (
//     <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium w-fit">
//       {error ? (
//         <div className="flex items-center gap-2">
//           <span>{error}</span>
//           {error.includes('location access') && (
//             <button
//               onClick={() => setRetry(!retry)}
//               className="text-blue-600 underline text-xs"
//             >
//               Retry
//             </button>
//           )}
//         </div>
//       ) : distance ? (
//         `${distance} km away from pickup`
//       ) : (
//         'Calculating distance...'
//       )}
//     </div>
//   );
// };

// DistanceBadge.propTypes = {
//   dat: PropTypes.shape({
//     lga: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.shape({
//         lat: PropTypes.number,
//         lng: PropTypes.number,
//       }),
//     ]),
//     LGA: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.shape({
//         lat: PropTypes.number,
//         lng: PropTypes.number,
//       }),
//     ]),
//   }),
// };

// export default DistanceBadge;







import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const DistanceBadge = ({ dat }) => {
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(false);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address,
            key: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
          },
        }
      );
      const { results } = response.data;
      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        return { lat, lng };
      }
      throw new Error('No coordinates found for address');
    } catch (err) {
      console.error('Geocoding error:', err);
      throw err;
    }
  };

  const fetchDistance = async () => {
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          let lgaLat, lgaLng;
          const lga = dat?.lga || dat?.LGA;
          if (lga) {
            if (typeof lga === 'object' && lga.lat && lga.lng) {
              lgaLat = lga.lat;
              lgaLng = lga.lng;
            } else {
              const coords = await geocodeAddress(lga);
              lgaLat = coords.lat;
              lgaLng = coords.lng;
            }

            const calculatedDistance = calculateDistance(
              userLat,
              userLng,
              lgaLat,
              lgaLng
            );
            setDistance(calculatedDistance);
            setError(null);
          } else {
            setError('34km away from pickup'); // Your original fallback
          }
        },
        (geoError) => {
          console.error('Geolocation error:', geoError);
          setError(
            geoError.code === 1
              ? 'Please allow location access to calculate distance'
              : 'Unable to get your location'
          );
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } catch (err) {
      setError('Failed to calculate distance');
    }
  };

  useEffect(() => {
    fetchDistance();
  }, [dat?.lga, dat?.LGA, retry]);

  return (
    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium w-fit">
      {error ? (
        <div className="flex items-center gap-2">
          <span>{error}</span>
          {error.includes('location access') && (
            <button
              onClick={() => setRetry(!retry)}
              className="text-blue-600 underline text-xs"
            >
              Retry
            </button>
          )}
        </div>
      ) : distance ? (
        `${distance} km away from pickup`
      ) : (
        'Calculating distance...'
      )}
    </div>
  );
};

DistanceBadge.propTypes = {
  dat: PropTypes.shape({
    lga: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
    ]),
    LGA: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
    ]),
  }),
};

export default DistanceBadge;