import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Databases } from 'appwrite';
import { client } from '../AppwriteService';
import { FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
import React from 'react';

interface Volunteer {
    $id: string;
    name: string;
    profilePictureUrl: string;
    bio: string;
    location: string;
}

const databases = new Databases(client);

function Details() {
    const [volunteerProfiles, setVolunteerProfiles] = useState<Volunteer[]>([]);

    useEffect(() => {
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

        fetchVolunteerProfiles();
    }, []);

    return (
        <div className="container mx-auto p-4">
            {/* Volunteer Profiles Section */}
            <motion.h2 className="text-2xl font-bold mb-6 flex items-center justify-center md:justify-start">
                <FaUsers className="mr-2" /> Latest Volunteer Profiles
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {volunteerProfiles.map((volunteer) => (
                    <motion.div
                        key={volunteer.$id}
                        className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center"
                    >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 mb-4 mx-auto overflow-hidden rounded-full border-4 border-blue-500">
                            <img
                                src={volunteer.profilePictureUrl}
                                alt={volunteer.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">{volunteer.name}</h3>
                        <p className="text-sm mb-2 text-center">{volunteer.bio || 'No bio available.'}</p>
                        <p className="text-sm mb-4 text-center">Location: {volunteer.location}</p>
                        <Link
                            to={`/volunteer-details/${volunteer.$id}`}
                            className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded transition duration-300 hover:bg-blue-600 transform hover:scale-105 mx-auto block text-center"
                        >
                            View Details
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default Details;
