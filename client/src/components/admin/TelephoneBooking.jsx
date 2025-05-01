import { useState } from 'react';

function TelephoneBooking() {
  const [formData, setFormData] = useState({
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
    images: [],
    isPerishable: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Replace with API call or further logic as needed
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full text-black font-semibold  bg-white rounded-lg shadow-md p-6">
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
                  <label className="block text-sm text-gray-600 mb-2">Is it personal or for Company</label>
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
                      type="text"
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
                <label className="block text-sm text-gray-600 mb-1">Personnel Phone no</label>
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
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="upload-1"
                    />
                    <label htmlFor="upload-1" className="cursor-pointer">
                      <p className="text-sm text-gray-600">Drag and drop here or</p>
                      <p className="text-sm text-green-500 underline">upload from device</p>
                    </label>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">&nbsp;</label>
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="upload-2"
                    />
                    <label htmlFor="upload-2" className="cursor-pointer">
                      <p className="text-sm text-gray-600">Add another picture here</p>
                    </label>
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
            className="w-full bg-green-500 text-white py-2 rounded-full font-medium hover:bg-green-600 transition-colors"
          >
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default TelephoneBooking