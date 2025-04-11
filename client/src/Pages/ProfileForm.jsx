import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants for step transitions
const stepVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" } },
};

const ProfileForm = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");


    // Redirect if no userEmail is provided
    useEffect(() => {
      if (!email) {
        toast.error("No email provided for profile creation. Please try registering again.", {
          style: { background: "#F44336", color: "white" },
        });
        navigate("/signup");
      }
    }, [email, navigate]);

  // Form state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userEmail: email || "",
    address: "",
    age: "",
    gender: "",
    dateOfBirth: "",
    state: "",
    LGA: "",
    maritalStatus: "",
  });
  const [loading, setLoading] = useState(false);



  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate maritalStatus before submission
    if (!formData.maritalStatus) {
      toast.error("Please select your marital status", {
        style: { background: "#F44", color: "white" },
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/profile/create`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success(response.data.message || "Profile created successfully", {
        style: { background: "#4CAF50", color: "white" },
      });

      // Redirect to dashboard after success
      setTimeout(() => {
        navigate("/dashboard"); // Changed to /dashboard
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "An error occurred while creating the profile",
        {
          style: { background: "#F44", color: "white" },
        }
      );
    }
  };

  // Move to the next step
  const nextStep = () => {
    if (step === 1) {
      if (!formData.age || !formData.gender || !formData.dateOfBirth) {
        toast.error("Please fill in all required fields", {
          style: { background: "#F44", color: "white" },
        });
        return;
      }
    } else if (step === 2) {
      if (!formData.address || !formData.state || !formData.LGA) {
        toast.error("Please fill in all required fields", {
          style: { background: "#F44", color: "white" },
        });
        return;
      }
    }
    setStep(step + 1);
  };

  // Move to the previous step
  const prevStep = () => {
    setStep(step - 1);
  };

  // Step 1: Personal Info
  const Step1 = () => (
    <motion.div
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-center">Personal Information</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Age <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="25"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender <span className="text-red-500">*</span>
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
          disabled={loading}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
          disabled={loading}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={nextStep}
          className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300"
          disabled={loading}
        >
          Next
        </button>
      </div>
    </motion.div>
  );

  // Step 2: Address Info
  const Step2 = () => (
    <motion.div
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-center">Address Information</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main St"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          State <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="Lagos"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          LGA <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="LGA"
          value={formData.LGA}
          onChange={handleChange}
          placeholder="Ikeja"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
          disabled={loading}
        />
      </div>
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition duration-300"
          disabled={loading}
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300"
          disabled={loading}
        >
          Next
        </button>
      </div>
    </motion.div>
  );

  // Step 3: Additional Info & Review
  const Step3 = () => (
    <motion.div
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-center">Additional Information</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Marital Status <span className="text-red-500">*</span>
        </label>
        <select
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
          disabled={loading}
        >
          <option value="">Select Marital Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>
      </div>

      {/* Review Section */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Review Your Information</h3>
        <p><strong>Email:</strong> {formData.userEmail}</p>
        <p><strong>Age:</strong> {formData.age}</p>
        <p><strong>Gender:</strong> {formData.gender}</p>
        <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
        <p><strong>Address:</strong> {formData.address}</p>
        <p><strong>State:</strong> {formData.state}</p>
        <p><strong>LGA:</strong> {formData.LGA}</p>
        <p><strong>Marital Status:</strong> {formData.maritalStatus || "Not selected"}</p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition duration-300"
          disabled={loading}
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Submit"
          )}
          {loading && "Submitting..."}
        </button>
      </div>
    </motion.div>
  );

  return (
    <section className="py-12 px-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-8">
        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-1/3 h-2 rounded-full ${
                step >= s ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          {step === 1 && <Step1 key="step1" />}
          {step === 2 && <Step2 key="step2" />}
          {step === 3 && <Step3 key="step3" />}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProfileForm;