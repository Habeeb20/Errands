import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion"; // Import framer-motion
import im from "../../assets/Frame 1171276669.png";
import im2 from "../../assets/Frame 1171278492 (1).png";
import im3 from "../../assets/image.png";
import im4 from "../../assets/Rectangle 828125.png";
import im5 from "../../assets/Frame 1171276669.png"
import im6 from "../../assets/Frame 1171278488.png"
import im7 from "../../assets/Frame 1171278490.png"


const sectionVariants = {
  hidden: { opacity: 0, y: 50 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }, 
};


const AnimatedSection = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 }); 

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      {children}
    </motion.div>
  );
};

const Home1 = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <AnimatedSection>
        <section
          className="relative bg-cover bg-center h-[500px] md:h-[600px] flex items-center justify-center text-center"
          style={{ backgroundImage: `url(${im3})` }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              We run e-rrands for you <br /> with ease and confidence
            </h1>
            <p className="text-lg md:text-xl mb-6">
              People are always on the move with little time to get everything done. Our logistics can achieve everything with ease.
            </p>
            <Link
              to="/signup"
              className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </section>
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection>
        <section className="bg-red-500 text-white py-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">1000</h3>
              <p className="text-sm">erranders</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">100%</h3>
              <p className="text-sm">Assurance</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">100%</h3>
              <p className="text-sm">Confident</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">1000</h3>
              <p className="text-sm">Users Nationwide</p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Logistics Services Section */}
      <AnimatedSection>
        <section className="py-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            We take the burden of <span className="text-green-500">logistics</span> off you.
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Discover shipping and logistics service options from e-rrands through our connection with our partners.
          </p>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service Card 1 */}
            <motion.div
              className="bg-white shadow-md rounded-lg p-4 text-center"
              whileHover={{ scale: 1.05 }} // Add hover animation
              transition={{ duration: 0.3 }}
            >
              <img
                src={im5}
                alt="GIG Logistics"
                className="h-16 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">GIG Logistics</h3>
              <p className="text-sm text-gray-600">Express Delivery</p>
            </motion.div>
            {/* Service Card 2 */}
            <motion.div
              className="bg-white shadow-md rounded-lg p-4 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={im6}
                alt="DHL"
                className="h-16 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">DHL</h3>
              <p className="text-sm text-gray-600">International Shipping</p>
            </motion.div>
            {/* Service Card 3 */}
            <motion.div
              className="bg-white shadow-md rounded-lg p-4 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={im7}
                alt="GIG Logistics"
                className="h-16 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">GIG Logistics</h3>
              <p className="text-sm text-gray-600">Express Delivery</p>
            </motion.div>
            {/* Service Card 4 */}
            <motion.div
              className="bg-white shadow-md rounded-lg p-4 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={im2}
                alt="FedEx"
                className="h-16 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">FedEx</h3>
              <p className="text-sm text-gray-600">Global Shipping</p>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Move Packages Section */}
      <AnimatedSection>
        <section className="py-12 px-4 bg-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Move packages by allowing people move it for you
          </h2>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Form */}
            <div className="flex-1">
              <form className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Location</label>
                    <input
                      type="text"
                      placeholder="Enter pick-up location"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off Location</label>
                    <input
                      type="text"
                      placeholder="Enter drop-off location"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item to be delivered</label>
                    <input
                      type="text"
                      placeholder="Enter item"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      placeholder="Enter quantity"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Would you prefer to upload images?</label>
                    <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-300"
                >
                  Search
                </button>
              </form>
            </div>
            {/* Image */}
            <div className="flex-1">
              <img src={im} alt="Delivery Person" className="w-full h-64 object-cover rounded-md" />
              <p className="text-center text-gray-600 mt-2">shutterstock_230944142</p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Task Delegation Section */}
      <AnimatedSection>
        <section className="py-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Send people to different task for you on our <span className="text-green-500">messenger</span>
          </h2>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Image */}
            <div className="flex-1">
              <img src={im4} alt="Task Person" className="w-full h-64 object-cover rounded-md" />
            </div>
            {/* Task Options */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {["Wash", "Clean", "Go to Market", "Get Groceries", "Pick-up", "Drop-off"].map((task, index) => (
                <motion.div
                  key={index}
                  className="bg-green-100 p-4 rounded-md text-center"
                  whileHover={{ scale: 1.05 }} // Add hover animation
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold">{task}</h3>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="text-center text-gray-600 mt-8">
            More Information <a href="#" className="text-blue-500 hover:underline">here</a> and{" "}
            <a href="#" className="text-blue-500 hover:underline">here</a>.
          </p>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default Home1;