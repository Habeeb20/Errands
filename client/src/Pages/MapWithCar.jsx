import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

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

const MapWithCar = () => {
  const [pickup, setPickup] = useState("Abeokuta, Ogun State, Nigeria");
  const [destination, setDestination] = useState("Sokoto, Sokoto State, Nigeria");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [path, setPath] = useState([]);
  const [carPosition, setCarPosition] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const mapRef = useRef(null);

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

  // Generate a simple path (straight line with intermediate points)
  const generatePath = (start, end) => {
    if (!start || !end) return [];

    const numPoints = 50; // Number of intermediate points
    const path = [];
    const latDiff = (end.lat - start.lat) / numPoints;
    const lngDiff = (end.lng - start.lng) / numPoints;

    for (let i = 0; i <= numPoints; i++) {
      const lat = start.lat + latDiff * i;
      const lng = start.lng + lngDiff * i;
      path.push([lat, lng]); // Leaflet uses [lat, lng] format
    }
    return path;
  };

  // Handle form submission to fetch coordinates and generate path
  const handleFetchRoute = async () => {
    const pickupResult = await fetchCoordinates(pickup, setPickupCoords);
    const destinationResult = await fetchCoordinates(destination, setDestinationCoords);

    if (pickupResult && destinationResult) {
      const newPath = generatePath(pickupResult, destinationResult);
      setPath(newPath);
      setCarPosition(newPath[0]); // Start at the beginning of the path
    }
  };

  // Animate the car along the path
  const startRide = () => {
    if (path.length === 0) {
      alert("Please fetch a route first by entering valid pickup and destination addresses.");
      return;
    }

    if (isMoving) return;
    setIsMoving(true);

    let index = 0;
    const animate = () => {
      if (index < path.length - 1) {
        setCarPosition(path[index]);
        index++;
        setTimeout(() => requestAnimationFrame(animate), 100); // 100ms delay per step
      } else {
        setIsMoving(false);
        alert("Ride completed!");
      }
    };
    requestAnimationFrame(animate);
  };

  // Default center (Nigeria)
  const defaultCenter = [9.0, 8.0];
  const mapCenter = pickupCoords
    ? [pickupCoords.lat, pickupCoords.lng]
    : defaultCenter;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Ride Simulation Map</h2>

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
        {/* Draw the route path */}
        {path.length > 0 && (
          <Polyline positions={path} color="red" weight={3} opacity={0.8} />
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