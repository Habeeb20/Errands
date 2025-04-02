
import { Link } from "react-router-dom";


import shortStayImage from "../../assets/image (3).png"; 
import longStayImage from "../../assets/Rectangle 828115.png"; 

const Home3 = () => {
  return (
    <section className="py-12 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Short Stay */}
        <div className="bg-white shadow-md rounded-lg flex flex-col md:flex-row items-center p-6">
          <div className="w-full md:w-2/3 md:pr-6 text-center md:text-left order-2 md:order-1">
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              Are you looking for where to spend couple of days?
            </h3>
            <p className="text-gray-600 mb-4">
              Our short-stay would do justice to that
            </p>
            <Link
              to="/short-stay"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300"
            >
              Go to short stay
            </Link>
          </div>
          <div className="w-full md:w-1/3 mb-4 md:mb-0 order-1 md:order-2">
            <img
              src={shortStayImage}
              alt="Couple"
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        </div>

        {/* Card 2: Long Stay */}
        <div className="bg-white shadow-md rounded-lg flex flex-col md:flex-row items-center p-6">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <img
              src={longStayImage}
              alt="Person celebrating"
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
          <div className="w-full md:w-2/3 md:pl-6 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              Join us for a long stay for your holiday, honeymoon, time-out, retreat and get up to 10% off
            </h3>
            <p className="text-gray-600 mb-4">
              We have quite the number of accommodation available for your use incase you want to stay longer
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Lagos</option>
                  <option>Abuja</option>
                  <option>Port Harcourt</option>
                </select>
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  placeholder="Check-in Date"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  placeholder="Check-out Date"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <Link
                to="/check-availability"
                className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300"
              >
                Check it out
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home3;