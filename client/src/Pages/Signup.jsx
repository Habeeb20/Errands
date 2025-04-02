import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import signupImage from "../assets/logist.jpg"; 
import Navbar from "../components/Navbar";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [userType, setUserType] = useState("User");

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== retypePassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signup submitted:", { email, password, userType });
    // Add your signup logic here
  };

  return (
    <>
    <Navbar />
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionVariants}
      className="py-12 px-4 bg-gray-100 min-h-screen flex items-center justify-center"
    >
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white shadow-md rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="James Johnson"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="20"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Re-type Password
              </label>
              <input
                type="password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                placeholder="20"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="User"
                  checked={userType === "User"}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                User
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Errander"
                  checked={userType === "Errander"}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                Errander
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition duration-300"
            >
              Sign up
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        {/* Image */}
        <div className="hidden md:block">
          <img
            src={signupImage}
            alt="Person in warehouse"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </motion.section>
    </>

  );
};

export default Signup;