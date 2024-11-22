import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { account } from '../AppwriteService'; // Assuming AppwriteService is set up
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();

    // Effect to check if a user is logged in and their role
    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const user = await account.get(); // Fetch logged-in user
                if (user) {
                    const role = localStorage.getItem('userRole'); // Assuming you stored the role in localStorage
                    if (role === 'volunteer') {
                        navigate('/home'); // Redirect to volunteer page
                    }
                }
            } catch (error) {
                console.error('Error checking user role:', error);
            }
        };

        checkUserRole();
    }, [navigate]);

    return (
        <div
            className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
            // style={{ backgroundImage: `url('./assets/zamcare-bg.jpg')` }} // Replace with your image path
        >
            {/* Background Overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black bg-opacity-70 z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1.5 }}
            />

            {/* Content Box */}
            <motion.div
                className="relative z-10 text-center px-8 py-12 bg-white bg-opacity-90 rounded-lg shadow-lg backdrop-blur-md max-w-xl"
                initial={{ opacity: 0, scale: 0.9, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
            >
                {/* Welcome Text */}
                <motion.h1
                    className="text-5xl font-bold text-gray-900 mb-6"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    Welcome to ZamCare
                </motion.h1>

                {/* Mission Statement */}
                <motion.p
                    className="text-lg text-gray-700 mb-8"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    At ZamCare, we believe in nurturing hope and providing support to orphans and communities. Together, we can build a future filled with opportunity, compassion, and growth.
                </motion.p>

                {/* Call-to-Action Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                >
                    <Link
                        to="/login"
                        className="inline-block text-white font-semibold bg-indigo-600 px-10 py-4 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                    >
                        Get Started
                    </Link>
                </motion.div>
            </motion.div>

            {/* Stats Section */}
            <div className="flex flex-wrap justify-around items-center mt-8 gap-8 bg-gray-800 p-6 rounded-lg shadow-md">
  <div className="text-center">
    <h3 className="text-4xl font-extrabold text-indigo-500">500+</h3>
    <p className="text-lg text-gray-300 mt-2">Children Supported</p>
  </div>
  <div className="text-center">
    <h3 className="text-4xl font-extrabold text-indigo-500">$250K+</h3>
    <p className="text-lg text-gray-300 mt-2">Donations Received</p>
  </div>
  <div className="text-center">
    <h3 className="text-4xl font-extrabold text-indigo-500">120+</h3>
    <p className="text-lg text-gray-300 mt-2">Volunteers</p>
  </div>
</div>


            {/* Additional Info Section */}
            <motion.div
                className="relative z-10 mt-12 text-center text-white max-w-2xl px-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}
            >
                <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
                <p className="text-lg mb-8">
                    ZamCare is dedicated to empowering orphans through access to education, health care, and community support.
                    Join us in making a lasting impact by volunteering, donating, or simply spreading the word.
                </p>
                <p className="text-lg">
                    Ready to help? <Link to="/about" className="underline text-indigo-300 hover:text-indigo-500">Learn more about our mission</Link> or <Link to="/volunteer" className="underline text-indigo-300 hover:text-indigo-500">Become a Volunteer</Link>.
                </p>
            </motion.div>
        </div>
    );
};

export default LandingPage;
