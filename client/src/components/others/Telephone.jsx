import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../Footer';
import Navbar from '../Navbar';

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

function Telephone() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [formData, setFormData] = useState(() => {
        // Restore formData from localStorage if it exists
        const savedFormData = localStorage.getItem('telephoneFormData');
        return savedFormData ? JSON.parse(savedFormData) : {
            pickupLocation: '',
            dropoffLocation: '',
            item: '',
            quantity: 1,
            isOrder: false,
            needsIdCard: false,
            gender: '',
            isPersonal: false,
            pickupTime: '07:45 pm',
            pickupDate: '09/01/2024',
            personnelPhone: '',
            needsCar: false,
            vehicleType: '',
            picture: '',
            picture1: '',
            isPerishable: false,
        };
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [request, setRequest] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false);

    const pickupInputRef = useRef(null);
    const dropoffInputRef = useRef(null);

    // Load Google Maps API script
    useEffect(() => {
        const loadGoogleMapsScript = () => {
            if (window.google) {
                setIsGoogleApiLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => setIsGoogleApiLoaded(true);
            script.onerror = () => console.error('Failed to load Google Maps API');
            document.head.appendChild(script);
        };

        loadGoogleMapsScript();
    }, []);

    // Initialize Google Autocomplete
    useEffect(() => {
        if (!isGoogleApiLoaded || !pickupInputRef.current || !dropoffInputRef.current) return;

        const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupInputRef.current, {
            types: ['geocode'],
            componentRestrictions: { country: 'ng' }
        });

        const dropoffAutocomplete = new window.google.maps.places.Autocomplete(dropoffInputRef.current, {
            types: ['geocode'],
            componentRestrictions: { country: 'ng' }
        });

        pickupAutocomplete.addListener('place_changed', () => {
            const place = pickupAutocomplete.getPlace();
            if (place.formatted_address) {
                setFormData((prev) => ({
                    ...prev,
                    pickupLocation: place.formatted_address
                }));
            }
        });

        dropoffAutocomplete.addListener('place_changed', () => {
            const place = dropoffAutocomplete.getPlace();
            if (place.formatted_address) {
                setFormData((prev) => ({
                    ...prev,
                    dropoffLocation: place.formatted_address
                }));
            }
        });
    }, [isGoogleApiLoaded]);

    // Check authentication on mount and restore formData
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login?redirect=/telephone');
        } else {
            setIsAuthenticated(true);
            socket.emit('joinUserRoom', JSON.parse(atob(token.split('.')[1])).id);
            // Clear saved formData from localStorage after restoring
            localStorage.removeItem('telephoneFormData');
        }
    }, [navigate]);

    // Socket.IO listeners
    useEffect(() => {
        socket.on('newBid', (updatedRequest) => {
            if (updatedRequest._id === request?._id) {
                setRequest(updatedRequest);
            }
        });

        socket.on('requestUpdated', (updatedRequest) => {
            if (updatedRequest._id === request?._id) {
                setRequest(updatedRequest);
                setChatMessages(updatedRequest.chatMessages);
            }
        });

        socket.on('newMessage', (updatedRequest) => {
            if (updatedRequest._id === request?._id) {
                setChatMessages(updatedRequest.chatMessages);
            }
        });

        return () => {
            socket.off('newBid');
            socket.off('requestUpdated');
            socket.off('newMessage');
        };
    }, [request]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = async (e, imageField) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            const file = files[0];
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            uploadFormData.append('upload_preset', 'essential');
            uploadFormData.append('folder', 'requests');

            const response = await fetch('https://api.cloudinary.com/v1_1/dc0poqt9l/image/upload', {
                method: 'POST',
                body: uploadFormData,
            });
            const data = await response.json();
            if (response.ok) {
                setFormData((prev) => ({
                    ...prev,
                    [imageField]: data.secure_url
                }));
                toast.success('Image uploaded successfully!');
            } else {
                console.error('Error uploading image:', data);
                toast.error('Error uploading image to Cloudinary');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error uploading image to Cloudinary');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Save formData to localStorage before redirecting
                localStorage.setItem('telephoneFormData', JSON.stringify(formData));
                navigate('/login?redirect=/telephone');
                return;
            }
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                setRequest(data);
                setIsModalOpen(true);
                socket.emit('newRequest', data._id);
                toast.success('Request submitted successfully!');
            } else {
                toast.error(data.message || 'Failed to submit request');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            toast.error('Error submitting request');
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptBid = async (bidId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/requests/${request._id}/accept-bid/${bidId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setRequest(data);
                toast.success('Bid accepted successfully!');
            } else {
                toast.error(data.message || 'Failed to accept bid');
            }
        } catch (error) {
            console.error('Error accepting bid:', error);
            toast.error('Error accepting bid');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/requests/${request._id}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: newMessage })
            });
            const data = await response.json();
            if (response.ok) {
                setNewMessage('');
                toast.success('Message sent successfully!');
            } else {
                toast.error(data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Error sending message');
        }
    };

    const handleCancelRequest = async (reason) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/requests/${request._id}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason })
            });
            const data = await response.json();
            if (response.ok) {
                setIsModalOpen(false);
                toast.success('Request cancelled successfully!');
            } else {
                toast.error(data.message || 'Failed to cancel request');
            }
        } catch (error) {
            console.error('Error cancelling request:', error);
            toast.error('Error cancelling request');
        }
    };

    if (!isAuthenticated) return null;

    return (
        <>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Navbar />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full text-black font-semibold bg-white rounded-lg shadow-md p-6 relative">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Define the Job</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Job Details Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Job Details</h3>
                            <div className="space-y-4">
                                {/* Pickup and Dropoff Locations */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1">Pick up Location</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="pickupLocation"
                                                ref={pickupInputRef}
                                                value={formData.pickupLocation}
                                                onChange={handleChange}
                                                placeholder="Enter pickup Location"
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">▼</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1">Drop off Location</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="dropoffLocation"
                                                ref={dropoffInputRef}
                                                value={formData.dropoffLocation}
                                                onChange={handleChange}
                                                placeholder="Enter dropoff Location"
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">▼</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Item and Quantity */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1">Item</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="item"
                                                value={formData.item}
                                                onChange={handleChange}
                                                placeholder="What you want to deliver"
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">▼</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1">Quantity</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                min="1"
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">▼</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Is it an Order? and Needs ID Card */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-2">Is it an order?</label>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isOrder"
                                                    value="true"
                                                    checked={formData.isOrder === true}
                                                    onChange={() => setFormData((prev) => ({ ...prev, isOrder: true }))}
                                                    className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">Yes</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isOrder"
                                                    value="false"
                                                    checked={formData.isOrder === false}
                                                    onChange={() => setFormData((prev) => ({ ...prev, isOrder: false }))}
                                                    className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">No</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-2">Would errander be needing an ID card to pick up</label>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="needsIdCard"
                                                    value="true"
                                                    checked={formData.needsIdCard === true}
                                                    onChange={() => setFormData((prev) => ({ ...prev, needsIdCard: true }))}
                                                    className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">Yes</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="needsIdCard"
                                                    value="false"
                                                    checked={formData.needsIdCard === false}
                                                    onChange={() => setFormData((prev) => ({ ...prev, needsIdCard: false }))}
                                                    className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">No</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Gender and Is it Personal */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-2">Gender</label>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="male"
                                                    checked={formData.gender === 'male'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">Male</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="female"
                                                    checked={formData.gender === 'female'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">Female</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-2">Is it personal</label>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isPersonal"
                                                    value="true"
                                                    checked={formData.isPersonal === true}
                                                    onChange={() => setFormData((prev) => ({ ...prev, isPersonal: true }))}
                                                    className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">Yes</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isPersonal"
                                                    value="false"
                                                    checked={formData.isPersonal === false}
                                                    onChange={() => setFormData((prev) => ({ ...prev, isPersonal: false }))}
                                                    className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">No</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Pickup Time and Date */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1">Pickup Time</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="pickupTime"
                                                value={formData.pickupTime}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">●</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1">Pickup Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="pickupDate"
                                                value={formData.pickupDate}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">●</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Personnel Phone Number */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Phone number</label>
                                    <input
                                        type="text"
                                        name="personnelPhone"
                                        value={formData.personnelPhone}
                                        onChange={handleChange}
                                        placeholder="Phone number of someone we can call for details"
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Driving Details Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Driving Details</h3>
                            <div className="space-y-4">
                                {/* Needs a Car */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Will errander be needing a car?</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="needsCar"
                                                value="true"
                                                checked={formData.needsCar === true}
                                                onChange={() => setFormData((prev) => ({ ...prev, needsCar: true }))}
                                                className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">Yes</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="needsCar"
                                                value="false"
                                                checked={formData.needsCar === false}
                                                onChange={() => setFormData((prev) => ({ ...prev, needsCar: false }))}
                                                className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">No</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Vehicle Type */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Vehicle Type</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Truck', 'Car', 'Bus', 'Bike'].map((type) => (
                                            <label key={type} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="vehicleType"
                                                    value={type.toLowerCase()}
                                                    checked={formData.vehicleType === type.toLowerCase()}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1">Upload picture of the item(s)</label>
                                        <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, 'picture')}
                                                className="hidden"
                                                id="upload-1"
                                            />
                                            <label htmlFor="upload-1" className="cursor-pointer">
                                                <p className="text-sm text-gray-600">Drag and drop here or</p>
                                                <p className="text-sm text-green-500 underline">upload from device</p>
                                            </label>
                                            {formData.picture && (
                                                <p className="text-sm text-gray-600 mt-2">Uploaded: <a href={formData.picture} target="_blank" rel="noopener noreferrer">View Image</a></p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1"></label>
                                        <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, 'picture1')}
                                                className="hidden"
                                                id="upload-2"
                                            />
                                            <label htmlFor="upload-2" className="cursor-pointer">
                                                <p className="text-sm text-gray-600">Add another picture here</p>
                                            </label>
                                            {formData.picture1 && (
                                                <p className="text-sm text-gray-600 mt-2">Uploaded: <a href={formData.picture1} target="_blank" rel="noopener noreferrer">View Image</a></p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Is it Perishable */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Is it a perishable item?</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="isPerishable"
                                                value="true"
                                                checked={formData.isPerishable === true}
                                                onChange={() => setFormData((prev) => ({ ...prev, isPerishable: true }))}
                                                className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">Yes</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="isPerishable"
                                                value="false"
                                                checked={formData.isPerishable === false}
                                                onChange={() => setFormData((prev) => ({ ...prev, isPerishable: false }))}
                                                className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">No</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <p className="text-xs text-gray-500 mb-4">
                            Make sure everyone is still online before sending in request, for swift reply
                        </p>

                        {/* Send Request Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-green-500 text-white py-2 rounded-full font-medium hover:bg-green-600 transition-colors flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                'Send Request'
                            )}
                        </button>
                    </form>
                </div>

                {/* Modal */}
                {isModalOpen && request && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-4xl flex">
                            {/* Left Side: Bids and Status */}
                            <div className="flex-1 pr-4">
                                <h2 className="text-xl font-semibold mb-4">Request Status</h2>
                                {request.status === 'pending' && (
                                    <div className="flex items-center justify-center mb-4">
                                        <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="ml-2 text-gray-600">Waiting for erranders...</p>
                                    </div>
                                )}

                                {request.bids.length > 0 && request.status === 'pending' && (
                                    <div className="grid grid-cols-1 gap-4">
                                        {request.bids.map(bid => (
                                            <div key={bid._id} className="border p-4 rounded-lg">
                                                <p><strong>Errander:</strong> {bid.erranderId.firstName} {bid.erranderId.lastName}</p>
                                                <p><strong>Price:</strong> ₦{bid.price}</p>
                                                <p><strong>Email:</strong> {bid.erranderId.email}</p>
                                                <p><strong>Phone:</strong> {bid.erranderId.phone}</p>
                                                <button
                                                    onClick={() => handleAcceptBid(bid._id)}
                                                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {request.status === 'accepted' && (
                                    <p className="text-green-600">Request accepted by {request.erranderId.firstName} {request.erranderId.lastName}</p>
                                )}

                                {request.status === 'in_progress' && (
                                    <p className="text-blue-600">Request in progress...</p>
                                )}

                                {request.status === 'completed' && (
                                    <p className="text-green-600">Request completed!</p>
                                )}

                                {request.status === 'cancelled' && (
                                    <p className="text-red-600">Request cancelled: {request.cancellation.reason}</p>
                                )}

                                {request.status !== 'cancelled' && (
                                    <button
                                        onClick={() => {
                                            const reason = prompt('Enter reason for cancellation:');
                                            if (reason) handleCancelRequest(reason);
                                        }}
                                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Cancel Request
                                    </button>
                                )}
                            </div>

                            {/* Right Side: Chat */}
                            {request.status === 'accepted' && (
                                <div className="w-1/3 border-l pl-4">
                                    <h3 className="text-lg font-semibold mb-2">Chat</h3>
                                    <div className="h-64 overflow-y-auto border p-2 mb-2">
                                        {chatMessages.map((msg, index) => (
                                            <div key={index} className={`mb-2 ${msg.senderId.toString() === JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id ? 'text-right' : 'text-left'}`}>
                                                <p className={`inline-block p-2 rounded ${msg.senderId.toString() === JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                    {msg.message}
                                                </p>
                                                <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={handleSendMessage}>
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="w-full p-2 border rounded mb-2"
                                        />
                                        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                                            Send
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Telephone;