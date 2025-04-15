import  { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import signupImage from "../assets/logist.jpg"; 
import Navbar from "../components/Navbar";
// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [role, setRole] = useState("user"); 
    const [loading, setLoading] = useState(false); 
  

    const navigate = useNavigate();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.2 });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true); 
  
    
      if (password !== retypePassword) {
        setLoading(false);
        toast.error("Passwords do not match!");
        return;
      }

      
    try {
     
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, 
          {
            firstName,
            lastName,
            email,
            phone,
            password,
            role,
          }
        );
  
       
        toast.success(response.data.message || "Registration successful! Please check your email to verify your account.");
  
    
        setTimeout(() => {
            navigate(`/verifyemail?email=${encodeURIComponent(email)}`);
        }, 3000);
      } catch (error) {
        setLoading(false);
        // Show error message
        toast.error(
          error.response?.data?.message || "Registration failed. Please try again."
        );
      }
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
                   First Name
                 </label>
                 <input
                   type="text"
                   value={firstName}
                   onChange={(e) => setFirstName(e.target.value)}
                   placeholder="James"
                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                   required
                   disabled={loading}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Last Name
                 </label>
                 <input
                   type="text"
                   value={lastName}
                   onChange={(e) => setLastName(e.target.value)}
                   placeholder="Johnson"
                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                   required
                   disabled={loading}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Email
                 </label>
                 <input
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="james.johnson@example.com"
                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                   required
                   disabled={loading}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Phone
                 </label>
                 <input
                   type="text"
                   value={phone}
                   onChange={(e) => setPhone(e.target.value)}
                   placeholder="08012345678"
                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                   required
                   disabled={loading}
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
                   placeholder="********"
                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                   required
                   disabled={loading}
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
                   placeholder="********"
                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                   required
                   disabled={loading}
                 />
               </div>
               <div className="flex space-x-4">
                 <label className="flex items-center">
                   <input
                     type="radio"
                     value="user"
                     checked={role === "user"}
                     onChange={(e) => setRole(e.target.value)}
                     className="mr-2"
                     disabled={loading}
                   />
                   User
                 </label>
                 <label className="flex items-center">
                   <input
                     type="radio"
                     value="errander"
                     checked={role === "errander"}
                     onChange={(e) => setRole(e.target.value)}
                     className="mr-2"
                     disabled={loading}
                   />
                   Errander
                 </label>
                 {/* <label className="flex items-center">
                   <input
                     type="radio"
                     value="admin"
                     checked={role === "admin"}
                     onChange={(e) => setRole(e.target.value)}
                     className="mr-2"
                     disabled={loading}
                   />
                   Admin
                 </label> */}
               </div>
               <button
                 type="submit"
                 className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition duration-300 flex items-center justify-center"
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
                   "Sign up"
                 )}
                 {loading && "Registering..."}
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