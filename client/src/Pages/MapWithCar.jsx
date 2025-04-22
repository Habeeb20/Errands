// import React, { useState, useEffect, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import axios from "axios";

// // Custom car icon for Leaflet
// const carIcon = new L.Icon({
//   iconUrl: "https://img.icons8.com/color/48/000000/car--v1.png",
//   iconSize: [40, 40],
//   iconAnchor: [20, 20],
// });

// // Component to update map center dynamically
// const MapCenterUpdater = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (center) {
//       map.setView(center, map.getZoom());
//     }
//   }, [center, map]);
//   return null;
// };

// const MapWithCar = () => {
//   const [pickup, setPickup] = useState("Abeokuta, Ogun State, Nigeria");
//   const [destination, setDestination] = useState("Sokoto, Sokoto State, Nigeria");
//   const [pickupCoords, setPickupCoords] = useState(null);
//   const [destinationCoords, setDestinationCoords] = useState(null);
//   const [path, setPath] = useState([]);
//   const [carPosition, setCarPosition] = useState(null);
//   const [isMoving, setIsMoving] = useState(false);
//   const mapRef = useRef(null);

//   // Fetch coordinates for an address
//   const fetchCoordinates = async (address, setCoords) => {
//     try {
//       const response = await axios.post("http://localhost:8080/api/geocode", {
//         address,
//       });
//       if (response.data.status) {
//         setCoords(response.data.data);
//         return response.data.data;
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching coordinates:", error);
//       alert(`Failed to fetch coordinates for ${address}: ${error.message}`);
//       return null;
//     }
//   };

//   // Generate a simple path (straight line with intermediate points)
//   const generatePath = (start, end) => {
//     if (!start || !end) return [];

//     const numPoints = 50; // Number of intermediate points
//     const path = [];
//     const latDiff = (end.lat - start.lat) / numPoints;
//     const lngDiff = (end.lng - start.lng) / numPoints;

//     for (let i = 0; i <= numPoints; i++) {
//       const lat = start.lat + latDiff * i;
//       const lng = start.lng + lngDiff * i;
//       path.push([lat, lng]); // Leaflet uses [lat, lng] format
//     }
//     return path;
//   };

//   // Handle form submission to fetch coordinates and generate path
//   const handleFetchRoute = async () => {
//     const pickupResult = await fetchCoordinates(pickup, setPickupCoords);
//     const destinationResult = await fetchCoordinates(destination, setDestinationCoords);

//     if (pickupResult && destinationResult) {
//       const newPath = generatePath(pickupResult, destinationResult);
//       setPath(newPath);
//       setCarPosition(newPath[0]); // Start at the beginning of the path
//     }
//   };

//   // Animate the car along the path
//   const startRide = () => {
//     if (path.length === 0) {
//       alert("Please fetch a route first by entering valid pickup and destination addresses.");
//       return;
//     }

//     if (isMoving) return;
//     setIsMoving(true);

//     let index = 0;
//     const animate = () => {
//       if (index < path.length - 1) {
//         setCarPosition(path[index]);
//         index++;
//         setTimeout(() => requestAnimationFrame(animate), 100); // 100ms delay per step
//       } else {
//         setIsMoving(false);
//         alert("Ride completed!");
//       }
//     };
//     requestAnimationFrame(animate);
//   };

//   // Default center (Nigeria)
//   const defaultCenter = [9.0, 8.0];
//   const mapCenter = pickupCoords
//     ? [pickupCoords.lat, pickupCoords.lng]
//     : defaultCenter;

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4 text-center">Ride Simulation Map</h2>

//       {/* Input Form */}
//       <div className="mb-6 space-y-4">
//         <div>
//           <label className="block text-gray-700 mb-1 font-medium">Pickup Location</label>
//           <input
//             type="text"
//             value={pickup}
//             onChange={(e) => setPickup(e.target.value)}
//             placeholder="e.g., Abeokuta, Ogun State, Nigeria"
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 mb-1 font-medium">Destination</label>
//           <input
//             type="text"
//             value={destination}
//             onChange={(e) => setDestination(e.target.value)}
//             placeholder="e.g., Sokoto, Sokoto State, Nigeria"
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="flex space-x-4">
//           <button
//             onClick={handleFetchRoute}
//             className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
//           >
//             Fetch Route
//           </button>
//           <button
//             onClick={startRide}
//             disabled={isMoving}
//             className={`px-6 py-2 rounded-lg text-white transition duration-300 ${
//               isMoving
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-green-500 hover:bg-green-600"
//             }`}
//           >
//             {isMoving ? "Ride in Progress..." : "Start Ride"}
//           </button>
//         </div>
//       </div>

//       {/* Leaflet Map */}
//       <MapContainer
//         center={defaultCenter}
//         zoom={6}
//         style={{ height: "500px", width: "100%" }}
//         className="rounded-lg shadow-lg"
//         whenCreated={(map) => (mapRef.current = map)}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         <MapCenterUpdater center={mapCenter} />
//         {/* Draw the route path */}
//         {path.length > 0 && (
//           <Polyline positions={path} color="red" weight={3} opacity={0.8} />
//         )}
//         {/* Car marker */}
//         {carPosition && <Marker position={carPosition} icon={carIcon} />}
//         {/* Pickup and Destination markers */}
//         {pickupCoords && (
//           <Marker position={[pickupCoords.lat, pickupCoords.lng]} />
//         )}
//         {destinationCoords && (
//           <Marker position={[destinationCoords.lat, destinationCoords.lng]} />
//         )}
//       </MapContainer>
//     </div>
//   );
// };

// export default MapWithCar;












































import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import io from "socket.io-client";

// Connect to the backend Socket.IO server
const socket = io("http://localhost:8080", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Custom car icon for Leaflet
const carIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/color/48/000000/car--v1.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Component to update map center dynamically
const MapCenterUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

// Component to adjust map bounds to fit routes
const MapBoundsUpdater = ({ routes }) => {
  const map = useMap();
  useEffect(() => {
    if (routes && routes.length > 0) {
      // Collect all coordinates from all routes
      const allCoords = routes.flatMap((route) => route.path);
      if (allCoords.length > 0) {
        // Create bounds from coordinates
        const bounds = L.latLngBounds(allCoords);
        // Fit the map to the bounds with some padding
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [routes, map]);
  return null;
};

// Haversine formula to calculate distance between two points in kilometers
const haversineDistance = (pos1, pos2) => {
  const R = 6371; // Earth's radius in kilometers
  const φ1 = (pos1.lat * Math.PI) / 180;
  const φ2 = (pos2.lat * Math.PI) / 180;
  const Δφ = ((pos2.lat - pos1.lat) * Math.PI) / 180;
  const Δλ = ((pos2.lng - pos1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Calculate the minimum distance from a point to a polyline (route)
const distanceToRoute = (point, route) => {
  return Math.min(
    ...route.map((routePoint) =>
      haversineDistance(
        { lat: point[0], lng: point[1] },
        { lat: routePoint[0], lng: routePoint[1] }
      )
    )
  );
};

// Format time in MM:SS
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const MapWithCar = () => {
  const [pickup, setPickup] = useState("Abeokuta, Ogun State, Nigeria");
  const [destination, setDestination] = useState("Sokoto, Sokoto State, Nigeria");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routes, setRoutes] = useState([]); // Store all possible routes
  const [userPath, setUserPath] = useState([]); // Store the user's actual path
  const [carPosition, setCarPosition] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [distanceTraveled, setDistanceTraveled] = useState(0); // Total distance in kilometers
  const [activeRouteIndex, setActiveRouteIndex] = useState(0); // Index of the route the user is following
  const [elapsedTime, setElapsedTime] = useState(0); // Time elapsed in seconds
  const mapRef = useRef(null);
  const rideId = "ride_123"; // Unique ID for the ride (in a real app, generate dynamically)
  const lastPositionRef = useRef(null); // Store the last position to calculate distance
  const timerRef = useRef(null); // Reference for the timer interval

  // Fetch coordinates for an address
  const fetchCoordinates = async (address, setCoords) => {
    try {
      const response = await axios.post("http://localhost:8080/api/geocode", {
        address,
      });
      if (response.data.status) {
        setCoords(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      alert(`Failed to fetch coordinates for ${address}: ${error.message}`);
      return null;
    }
  };

  // Fetch routes using OSRM
  const fetchRoutes = async (start, end) => {
    try {
      const response = await axios.post("http://localhost:8080/api/get-routes", {
        start,
        end,
      });
      if (response.data.status) {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
      alert(`Failed to fetch routes: ${error.message}`);
      return [];
    }
  };

  // Handle form submission to fetch coordinates and routes
  const handleFetchRoute = async () => {
    const pickupResult = await fetchCoordinates(pickup, setPickupCoords);
    const destinationResult = await fetchCoordinates(destination, setDestinationCoords);

    if (pickupResult && destinationResult) {
      // Fetch possible routes
      const possibleRoutes = await fetchRoutes(pickupResult, destinationResult);
      setRoutes(possibleRoutes);
      setUserPath([[pickupResult.lat, pickupResult.lng]]);
      setCarPosition([pickupResult.lat, pickupResult.lng]);
      lastPositionRef.current = { lat: pickupResult.lat, lng: pickupResult.lng };
      setDistanceTraveled(0);
      setElapsedTime(0);
      socket.emit("joinRide", rideId);
    }
  };

  // Start tracking the user's real-time location
  const startRide = () => {
    if (!pickupCoords || !destinationCoords || routes.length === 0) {
      alert("Please fetch a route first by entering valid pickup and destination addresses.");
      return;
    }

    if (isMoving) return;
    setIsMoving(true);

    // Start the timer
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsedSeconds);
    }, 1000);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setIsMoving(false);
      clearInterval(timerRef.current);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = [latitude, longitude];
        console.log("User's current position:", newPosition);

        // Calculate distance from the last position
        const currentPosition = { lat: latitude, lng: longitude };
        if (lastPositionRef.current) {
          const distance = haversineDistance(lastPositionRef.current, currentPosition);
          setDistanceTraveled((prevDistance) => prevDistance + distance);
        }
        lastPositionRef.current = currentPosition;

        // Update the user's path
        setUserPath((prevPath) => {
          const newPath = [...prevPath, newPosition];
          return newPath;
        });

        // Update the car's position
        setCarPosition(newPosition);

        // Determine which route the user is closest to
        if (routes.length > 0) {
          const distances = routes.map((route, index) => ({
            index,
            distance: distanceToRoute(newPosition, route.path),
          }));
          const closestRoute = distances.reduce((min, current) =>
            current.distance < min.distance ? current : min
          );
          setActiveRouteIndex(closestRoute.index);
        }

        // Check if the user has reached the destination
        const distanceToDestination = haversineDistance(
          currentPosition,
          destinationCoords
        );
        if (distanceToDestination < 0.1) { // Within 100 meters
          stopTracking();
        }

        // Emit the location update to the backend
        socket.emit("updateLocation", {
          rideId,
          position: { lat: latitude, lng: longitude },
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert(`Failed to get location: ${error.message}`);
        setIsMoving(false);
        clearInterval(timerRef.current);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    // Listen for location updates from the backend
    socket.on("locationUpdate", (position) => {
      if (!position || typeof position.lat !== "number" || typeof position.lng !== "number") {
        console.warn("Invalid location update received:", position);
        return;
      }
      const newPosition = [position.lat, position.lng];
      const currentPosition = { lat: position.lat, lng: position.lng };

      if (lastPositionRef.current) {
        const distance = haversineDistance(lastPositionRef.current, currentPosition);
        setDistanceTraveled((prevDistance) => prevDistance + distance);
      }
      lastPositionRef.current = currentPosition;

      setUserPath((prevPath) => {
        const newPath = [...prevPath, newPosition];
        return newPath;
      });
      setCarPosition(newPosition);

      if (routes.length > 0) {
        const distances = routes.map((route, index) => ({
          index,
          distance: distanceToRoute(newPosition, route.path),
        }));
        const closestRoute = distances.reduce((min, current) =>
          current.distance < min.distance ? current : min
        );
        setActiveRouteIndex(closestRoute.index);
      }

      const distanceToDestination = haversineDistance(
        currentPosition,
        destinationCoords
      );
      if (distanceToDestination < 0.1) {
        stopTracking();
      }
    });

    // Stop tracking function
    const stopTracking = () => {
      navigator.geolocation.clearWatch(watchId);
      socket.off("locationUpdate");
      clearInterval(timerRef.current);
      setIsMoving(false);
      alert("Ride completed! You've reached your destination.");
    };
  };

  // Default center (Nigeria)
  const defaultCenter = [9.0, 8.0];
  const mapCenter = carPosition || (pickupCoords ? [pickupCoords.lat, pickupCoords.lng] : defaultCenter);

  // Clean up Socket.IO on component unmount
  useEffect(() => {
    return () => {
      socket.disconnect();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Real-Time Ride Tracking Map</h2>

      {/* Input Form */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Pickup Location</label>
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="e.g., Abeokuta, Ogun State, Nigeria"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Sokoto, Sokoto State, Nigeria"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleFetchRoute}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Fetch Route
          </button>
          <button
            onClick={startRide}
            disabled={isMoving}
            className={`px-6 py-2 rounded-lg text-white transition duration-300 ${
              isMoving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isMoving ? "Ride in Progress..." : "Start Ride"}
          </button>
        </div>
        {/* Display distance traveled and elapsed time */}
        {isMoving && (
          <div className="text-gray-700 mt-2 space-y-1">
            <div>Distance Traveled: {distanceTraveled.toFixed(2)} km</div>
            <div>Time Elapsed: {formatTime(elapsedTime)}</div>
          </div>
        )}
        {/* Display route options */}
        {routes.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Available Routes:</h3>
            <ul className="space-y-2">
              {routes.map((route, index) => (
                <li
                  key={index}
                  className={`p-2 rounded-lg ${
                    index === activeRouteIndex ? "bg-blue-100 border-blue-500 border" : "bg-gray-100"
                  }`}
                >
                  Route {index + 1}: {route.distance.toFixed(2)} km,{" "}
                  {route.duration.toFixed(1)} minutes
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={defaultCenter}
        zoom={6}
        style={{ height: "500px", width: "100%" }}
        className="rounded-lg shadow-lg"
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapCenterUpdater center={mapCenter} />
        <MapBoundsUpdater routes={routes} />
        {/* Draw all possible routes */}
        {routes.map((route, index) => (
          <Polyline
            key={index}
            positions={route.path}
            color={index === activeRouteIndex ? "blue" : "gray"}
            weight={index === activeRouteIndex ? 5 : 3}
            opacity={index === activeRouteIndex ? 0.8 : 0.5}
          />
        ))}
        {/* Draw the user's actual path */}
        {userPath.length > 0 && (
          <Polyline positions={userPath} color="red" weight={3} opacity={0.8} />
        )}
        {/* Car marker */}
        {carPosition && <Marker position={carPosition} icon={carIcon} />}
        {/* Pickup and Destination markers */}
        {pickupCoords && (
          <Marker position={[pickupCoords.lat, pickupCoords.lng]} />
        )}
        {destinationCoords && (
          <Marker position={[destinationCoords.lat, destinationCoords.lng]} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapWithCar;