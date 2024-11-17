import { useEffect, useState } from 'react';
import { Databases } from 'appwrite';
import { client } from '../AppwriteService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { FaChild } from 'react-icons/fa'; 
import { motion } from 'framer-motion';
import React from 'react';



const databases = new Databases(client);

interface ChildProfile {
  $id: string;
  name: string;
  age?: number;
  bio?: string;
  educationStatus?: string;
  healthStatus?: string;
  photoUrl?: string;
}

const ChildrenPage = () => {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildrenProfiles = async () => {
      try {
        setLoading(true);
        const response = await databases.listDocuments(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_CHILDREN_COLLECTION_ID
        );

        const childrenData = response.documents.map((doc: any) => ({
          $id: doc.$id,
          name: doc.name,
          age: doc.age,
          bio: doc.bio,
          educationStatus: doc.educationStatus,
          photoUrl: doc.photoUrl,
        })) as unknown as ChildProfile[];

        setChildren(childrenData);
      } catch (error) {
        console.error('Error fetching children profiles:', error);
        setError('Failed to load profiles. Please try again later.');
        toast.error('Failed to load profiles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChildrenProfiles();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="relative bg-blue-600 p-4 md:w-1/4 flex flex-col items-center md:items-start">
        <Link to="/" className="flex items-center text-white bg-blue-600 text-lg font-bold mb-4">
          <img src="/assets/k__2.png" alt="ZamCare Logo" className="h-16 w-16 mr-2" /> 
          ZamCare
        </Link>
        <div className="space-y-2 w-full">
          <Link to="/home" className="text-white bg-blue-600 flex items-center border border-white rounded-lg px-3 py-2 w-3/4 mx-auto transition duration-300 hover:bg-white hover:text-blue-600 transform hover:scale-105">
            <FaChild className="mr-2" /> Home
          </Link>
          <Link to="/donate" className="text-white bg-blue-600 flex items-center border border-white rounded-lg px-3 py-2 w-3/4 mx-auto transition duration-300 hover:bg-white hover:text-blue-600 transform hover:scale-105">
            Donate
          </Link>
          <Link to="/child" className="text-white bg-blue-600 flex items-center border border-white rounded-lg px-3 py-2 w-3/4 mx-auto transition duration-300 hover:bg-white hover:text-blue-600 transform hover:scale-105">
            Our Children
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:w-3/4 w-full p-6">
        <h1 className="text-3xl font-bold mb-4 text-center md:text-left">Meet Our Children</h1>
        <p className="mb-4 text-center md:text-left">Discover the stories and dreams of the children in our care.</p>

        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <motion.div key={child.$id} className="bg-white p-4 rounded shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <img
                src={child.photoUrl || '/path/to/default/image.png'}
                alt={child.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <h2 className="text-xl font-semibold mt-4 text-blue-600">{child.name}</h2>
              <p className="mt-2"><strong>Age:</strong> {child.age || 'N/A'}</p>
              <p><strong>Bio:</strong> {child.bio || 'No bio available.'}</p>
              <Link
                to= "/children-page"
                className="inline-block bg-blue-500 text-white font-semibold mt-4 py-2 px-4 rounded-full border border-transparent hover:bg-white hover:text-blue-500 hover:border-blue-500 transition duration-300"
              >
                View Details
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ChildrenPage;
