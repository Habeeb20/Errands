import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-gray-400 text-lg font-bold">
          <div className="bg-gray-200 h-8 w-24 rounded"></div> {/* Placeholder for logo */}
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`md:flex md:items-center md:space-x-6 ${
            isOpen ? "block" : "hidden"
          } absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 z-10`}
        >
          <Link
            to="/"
            className="block md:inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 mb-2 md:mb-0"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block md:inline-block text-gray-600 hover:text-green-500 transition duration-300 mb-2 md:mb-0"
          >
            About
          </Link>
          <Link
            to="/become-an-errander"
            className="block md:inline-block text-gray-600 hover:text-green-500 transition duration-300 mb-2 md:mb-0"
          >
            Become an errander
          </Link>
          <Link
            to="/telephone-booking"
            className="block md:inline-block text-gray-600 hover:text-green-500 transition duration-300 mb-2 md:mb-0"
          >
            Telephone booking
          </Link>
          <Link
            to="/e-messenger"
            className="block md:inline-block text-gray-600 hover:text-green-500 transition duration-300 mb-2 md:mb-0"
          >
            e-messenger
          </Link>
          <Link
            to="/contact"
            className="block md:inline-block text-gray-600 hover:text-green-500 transition duration-300 mb-2 md:mb-0"
          >
            Contact
          </Link>
          <Link
            to="/login"
            className="block md:inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 mb-2 md:mb-0"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;