import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion"; // Import framer-motion
import im from "../../assets/Frame 1171276669.png";
import im2 from "../../assets/Frame 1171278492 (1).png";
import im3 from "../../assets/image.png";
import im4 from "../../assets/Rectangle 828125.png";
import im5 from "../../assets/Frame 1171276669.png"
import im6 from "../../assets/Frame 1171278488.png"
import im7 from "../../assets/Frame 1171278490.png"
import axios from "axios";


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



const MessengerHomePart= () => {
 

  return (
    <div className="bg-gray-100">
    

   

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

export default MessengerHomePart;