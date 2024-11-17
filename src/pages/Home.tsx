import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Databases } from 'appwrite';
import { FaHeart, FaHandsHelping, FaHome, FaDonate } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import React from 'react';
import { client, account } from '../AppwriteService';

// Initialize ChartJS components
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

interface Child {
    age: number | null;
    educationStatus: string;
    healthStatus: string;
    hobbies: string[];
    createdBy: string;
    $id: string;
    name: string;
    bio?: string;
}

interface Volunteer {
    $id: string;
    name: string;
    profilePictureUrl: string;
    bio: string;
    location: string;
}

const databases = new Databases(client);

const Home = () => {
    const [childrenProfile, setChildrenProfile] = useState<Child[]>([]);
    const [volunteerProfiles, setVolunteerProfiles] = useState<Volunteer[]>([]);
    const navigate = useNavigate();

    const checkSession = async () => {
        try {
            await account.getSession('current');
        } catch (error) {
            navigate('/login');
        }
    };

    useEffect(() => {
        checkSession();

        const fetchChildrenProfile = async () => {
            try {
                const response = await databases.listDocuments(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_CHILDREN_COLLECTION_ID
                );
                setChildrenProfile(response.documents as unknown as Child[]);
            } catch (error) {
                console.error('Error fetching children profiles:', error);
            }
        };

        const fetchVolunteerProfiles = async () => {
            try {
                const response = await databases.listDocuments(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_VOLUNTEER_COLLECTION_ID
                );
                setVolunteerProfiles(response.documents as unknown as Volunteer[]);
            } catch (error) {
                console.error('Error fetching volunteer profiles:', error);
            }
        };

        fetchChildrenProfile();
        fetchVolunteerProfiles();
    }, []);

    const handleLogout = async () => {
        try {
            await account.deleteSession('current');
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const chartData = {
        labels: ['Children', 'Volunteers'],
        datasets: [
            {
                label: 'Number of Profiles',
                data: [childrenProfile.length, volunteerProfiles.length],
                borderColor: '#3498db',
                backgroundColor: '#3498db',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-blue-700 text-white py-4 px-6">
                <h1 className="text-3xl font-bold text-center animate__animated animate__fadeIn animate__delay-1s">ZamCare</h1>
            </header>

            {/* Content */}
            <div className="flex flex-1">
                {/* Navigation */}
                <nav className="w-1/4 bg-blue-600 text-white p-4 flex flex-col space-y-4">
                    <Link to="/home">
                        <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-400 font-medium rounded-md flex items-center space-x-2">
                            <FaHome />
                            <span>Home</span>
                        </button>
                    </Link>
                    <Link to="/board">
                        <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-400 font-medium rounded-md flex items-center space-x-2">
                            <FaDonate />
                            <span>Donate</span>
                        </button>
                    </Link>
                    <Link to="/volunteer">
                        <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-400 font-medium rounded-md flex items-center space-x-2">
                            <FaHandsHelping />
                            <span>Volunteers</span>
                        </button>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-red-500 hover:bg-red-400 font-medium rounded-md flex items-center space-x-2"
                    >
                        <FaHeart />
                        <span>Logout</span>
                    </button>
                </nav>

                {/* Main Content */}
                <main className="w-3/4 p-6 space-y-8">
                    {/* Welcome Section */}
                    <section className="text-center">
                        <h2 className="text-3xl font-bold text-blue-700 animate__animated animate__fadeIn animate__delay-2s">Welcome to ZamCare</h2>
                        <p className="text-gray-700 animate__animated animate__fadeIn animate__delay-3s">Empowering children and supporting communities together.</p>
                    </section>

                    {/* Charts Section */}
                    <section className="animate__animated animate__fadeIn animate__delay-4s">
                        <h3 className="text-2xl font-semibold text-gray-800">Overview of Children and Volunteers</h3>
                        <div className="w-full mt-6">
                            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
                        </div>
                    </section>

                    {/* Latest Children Profiles */}
                    <section className="animate__animated animate__fadeIn animate__delay-5s">
                        <h3 className="text-2xl font-semibold text-gray-800">Latest Children Profiles</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {childrenProfile.map((child) => (
                                <motion.div
                                    key={child.$id}
                                    className="bg-white shadow-lg rounded-lg p-4"
                                    whileHover={{ scale: 1.05 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h4 className="text-lg font-bold">{child.name}</h4>
                                    <p className="text-gray-600">{child.bio || 'No bio available'}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Volunteer Profiles */}
                    <section className="animate__animated animate__fadeIn animate__delay-6s">
                        <h3 className="text-2xl font-semibold text-gray-800">Meet Our Volunteers</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {volunteerProfiles.map((volunteer) => (
                                <motion.div
                                    key={volunteer.$id}
                                    className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center"
                                    whileHover={{ scale: 1.05 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <img
                                        src={volunteer.profilePictureUrl}
                                        alt={volunteer.name}
                                        className="w-16 h-16 rounded-full mb-2"
                                    />
                                    <h4 className="text-lg font-bold">{volunteer.name}</h4>
                                    <p className="text-gray-600">{volunteer.bio || 'No bio available'}</p>
                                    <p className="text-gray-500 text-sm">{volunteer.location}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-blue-800 text-white py-6 mt-auto">
                <div className="container mx-auto text-center">
                    <motion.p className="font-semibold text-lg" whileHover={{ scale: 1.1 }}>© 2024 ZamCare. All rights reserved.</motion.p>
                    <p className="text-sm mt-2">Contact: info@zamcare.org</p>
                    <div className="mt-4 space-x-4">
                        <motion.a href="https://facebook.com" target="_blank" className="text-white hover:text-blue-300" whileHover={{ scale: 1.1 }}>
                            Facebook
                        </motion.a>
                        <motion.a href="https://twitter.com" target="_blank" className="text-white hover:text-blue-300" whileHover={{ scale: 1.1 }}>
                            Twitter
                        </motion.a>
                        <motion.a href="https://instagram.com" target="_blank" className="text-white hover:text-blue-300" whileHover={{ scale: 1.1 }}>
                            Instagram
                        </motion.a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;