import React from 'react';
import picture from "../../assets/picture.png"
const HowItWorks = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">How does it work</h2>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Section - Steps */}
          <div className="flex flex-col sm:flex-row justify-between w-full lg:w-1/2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center w-full sm:w-1/3">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                1
              </div>
              <p className="text-gray-600">
                Register and get into the system so we can give you the best messengers
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center w-full sm:w-1/3">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                2
              </div>
              <p className="text-gray-600">
                Search and get into the system so we can give you the best messengers
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center w-full sm:w-1/3">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                2
              </div>
              <p className="text-gray-600">
                Send and get into the system so we can give you the best messengers
              </p>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
            <img
              src={picture}
              alt="Handshake and package delivery"
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-10 text-center text-gray-600">
          <p>
            More information about how it works and how it can revolutionize the business sector and
            how it can reduce unemployment drastically. More information about how it works and how it
            can revolutionize the business sector and how it can reduce unemployment drastically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;