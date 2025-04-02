import React from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-500 to-green-600 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo and Social Media Icons */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-bold mb-4">Logo</h2>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-300">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-gray-300">
              <FaWhatsapp size={20} />
            </a>
            <a href="#" className="hover:text-gray-300">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="hover:text-gray-300">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>

        {/* Column 1: Corporate Info */}
        <div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Corporate Info
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Accessibility
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Jobs
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Ad Choices
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                CA Notice
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms of Service <span className="text-yellow-300">• NEW</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2: NBC App */}
        <div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                NBC App
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Peacock
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Advertise
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Closed Captioning
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: PON Quick Links */}
        <div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Advertise
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Link TV Provider
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Casting
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Local Schedule
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Tickets and NBC Studio Tour
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter Subscription */}
        <div className="flex flex-col items-start">
          <h3 className="text-sm font-semibold mb-4">SUBSCRIBE TO OUR NEWSLETTER</h3>
          <div className="flex w-full max-w-xs">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 p-2 text-gray-800 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button className="bg-white text-green-600 px-4 py-2 rounded-r-md hover:bg-gray-200">
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Parental Guidelines */}
      <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-4"></div>
        <div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Parental Guidelines and TV Ratings
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Video Viewing Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Viewer Panel
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Shop
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;