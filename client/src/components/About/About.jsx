import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const About = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-green-50 to-gray-100">
        {/* Hero Section - Project Note */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-12 transform transition-all hover:shadow-2xl duration-500">
            {/* Header */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-6 text-center">
              About Errander
            </h1>

            {/* Tagline */}
            <p className="italic text-center text-green-600 mb-8 text-lg sm:text-xl">
              Connecting Communities, Delivering Solutions
            </p>

            {/* Content */}
            <div className="text-gray-700 space-y-6 text-base sm:text-lg leading-relaxed">
              <p>
                The Errander project is a transformative platform designed to streamline delivery services across Nigeria. By connecting users with reliable messengers in their local communities, Errander empowers businesses and individuals to send and receive packages with ease and efficiency.
              </p>

              <p>
                Our platform leverages a robust database of states and LGAs, allowing users to filter and find messengers based on their location—whether in bustling Lagos, serene Abuja, or the vibrant streets of Rivers. Features like real-time search, profile verification, and detailed messenger profiles ensure trust and convenience at every step.
              </p>

              <p>
                Beyond logistics, Errander is a movement to reduce unemployment by creating opportunities for local messengers. It revolutionizes the business sector by providing a seamless, tech-driven solution for last-mile delivery, fostering economic growth and community empowerment.
              </p>

              <p>
                As we continue to develop Errander, our mission remains clear: to deliver not just packages, but hope, opportunity, and connection across Nigeria’s diverse landscape.
              </p>

              {/* Signature */}
              <div className="mt-8 text-center">
                <p className="text-green-600 font-semibold">The Errander Team</p>
                <p className="text-gray-500 text-sm">May 2, 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Meet the Team Section */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-700 text-center mb-12">
              Meet the Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-green-50 rounded-xl shadow-md p-6 text-center transform transition-all hover:scale-105 duration-300">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member 1"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-green-200"
                />
                <h3 className="text-xl font-semibold text-gray-800">Jane Doe</h3>
                <p className="text-green-600 font-medium">Founder & CEO</p>
                <p className="text-gray-600 mt-2">
                  Passionate about connecting communities and driving innovation in logistics.
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="bg-green-50 rounded-xl shadow-md p-6 text-center transform transition-all hover:scale-105 duration-300">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member 2"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-green-200"
                />
                <h3 className="text-xl font-semibold text-gray-800">John Smith</h3>
                <p className="text-green-600 font-medium">Lead Developer</p>
                <p className="text-gray-600 mt-2">
                  Expert in building scalable, user-friendly platforms for seamless delivery experiences.
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="bg-green-50 rounded-xl shadow-md p-6 text-center transform transition-all hover:scale-105 duration-300">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member 3"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-green-200"
                />
                <h3 className="text-xl font-semibold text-gray-800">Aisha Bello</h3>
                <p className="text-green-600 font-medium">Operations Manager</p>
                <p className="text-gray-600 mt-2">
                  Dedicated to ensuring smooth operations and empowering local messengers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;