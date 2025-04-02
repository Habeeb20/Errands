import { motion, useInView } from "framer-motion"; // Import framer-motion
import { Link } from "react-router-dom";
import pickupImage from "../../assets/image (1).png";
import telephoneBookingImage from "../../assets/image (2).png";
import cricketImage from "../../assets/cricket.png";
import { useRef } from "react";
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

const Home2 = () => {
    return (
        <section className="py-12 px-4 bg-gray-100">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Card 1: Pick-up Something */}
                <AnimatedSection>
                    <div className="bg-white shadow-md rounded-lg flex flex-col md:flex-row items-center p-6">
                        <div className="w-full md:w-1/3 mb-4 md:mb-0">
                            <img
                                src={pickupImage}
                                alt="Person with phone"
                                className="w-full h-48 object-cover rounded-md"
                            />
                        </div>
                        <div className="w-full md:w-2/3 md:pl-6 text-center md:text-left">
                            <h3 className="text-xl md:text-2xl font-bold mb-2">
                                Are you looking for someone to pickup something for you?
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Just with a click you can find someone
                            </p>
                            <Link
                                to="/search"
                                className="inline-block bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300"
                            >
                                Go to search
                            </Link>
                        </div>
                    </div>


                </AnimatedSection>

                <AnimatedSection>
                    <div className="bg-white shadow-md rounded-lg flex flex-col md:flex-row items-center p-6">
                        <div className="w-full md:w-2/3 md:pr-6 text-center md:text-left order-2 md:order-1">
                            <h3 className="text-xl md:text-2xl font-bold mb-2">
                                Telephone booking
                            </h3>
                            <p className="text-gray-600 mb-4">
                                You can help others book logistics for their packages by using our third party link
                            </p>
                            <Link
                                to="/book-third-party"
                                className="inline-block bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300"
                            >
                                Book as a third party
                            </Link>
                        </div>
                        <div className="w-full md:w-1/3 mb-4 md:mb-0 order-1 md:order-2">
                            <img
                                src={telephoneBookingImage}
                                alt="Person with laptop"
                                className="w-full h-48 object-cover rounded-md"
                            />
                        </div>
                    </div>

                </AnimatedSection>

                <AnimatedSection >
                    <div className="bg-white shadow-md rounded-lg flex flex-col md:flex-row items-center p-6 md:col-span-2">
                        <div className="w-full md:w-1/3 mb-4 md:mb-0">
                            <img
                                src={cricketImage}
                                alt="Cricket player"
                                className="w-full h-48 object-cover rounded-md"
                            />
                        </div>
                        <div className="w-full md:w-2/3 md:pl-6 text-center md:text-left">
                            <p className="text-gray-600 mb-2">
                                Beginning 2025, we are proud to team up with two powerhouse franchises in the world of cricket: the
                            </p>
                            <h3 className="text-xl md:text-2xl font-bold mb-2">
                                CHENNAI SUPER KINGS (CSK) in the INDIAN PREMIER LEAGUE (IPL) and the JOBURG SUPER KINGS (JSK) in SA20.
                            </h3>
                            <p className="text-gray-500 italic mb-4">
                                Delivering excellence, on and off the field.
                            </p>
                            <Link
                                to="/learn-more"
                                className="inline-block bg-transparent border border-blue-500 text-blue-500 px-6 py-2 rounded-full hover:bg-blue-500 hover:text-white transition duration-300"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>

                </AnimatedSection>

            </div>
        </section>
    );
};

export default Home2;