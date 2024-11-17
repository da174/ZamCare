import { useEffect, useState } from 'react';
import { client, databases } from '../AppwriteService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import EditChildProfile from '../pages/EditChildProfile';
import React from 'react';

interface ChildProfile {
  $id: string;
  name: string;
  age?: number;
  bio?: string;
  educationStatus?: string;
  healthStatus?: string;
  photoUrl?: string;
  hobbies?: string;
  educationalNeeds?: string;
  createdBy?: string;
}

const ChildrenProfile = () => {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editChildId, setEditChildId] = useState<string | null>(null);

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
          healthStatus: doc.healthStatus,
          photoUrl: doc.photoUrl,
          hobbies: doc.hobbies,
          educationalNeeds: doc.educationalNeeds,
          createdBy: doc.createdBy,
        }));

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

  const handleDelete = async (childId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this profile? This action cannot be undone.');
    if (confirmDelete) {
      try {
        await databases.deleteDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_CHILDREN_COLLECTION_ID,
          childId
        );
        setChildren((prevChildren) => prevChildren.filter((child) => child.$id !== childId));
        toast.success('Profile deleted successfully!');
      } catch (error) {
        console.error('Error deleting child profile:', error);
        toast.error('Failed to delete profile. Please try again.');
      }
    }
  };

  const handleCloseEdit = () => {
    setEditChildId(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Meet Our Children</h1>
      <p className="mb-4 text-center">Discover the stories and dreams of the children in our care.</p>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      <div className="space-y-6">
        {children.map((child) => (
          <motion.div
            key={child.$id}
            className="flex flex-row bg-white p-4 rounded shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 h-1/2 w-full"
          >
            <div className="flex-shrink-0 w-1/2 h-full">
              <img
                src={child.photoUrl || '/assets/zamcare-bg.png'} 
                alt={child.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src = '/assets/zamcare-bg.png'; 
                }}
              />
            </div> 
            <div className="flex flex-col justify-start w-1/2 p-4">
              <h2 className="text-2xl font-semibold text-blue-600">{child.name}</h2>
              <p className="mt-2"><strong>Age:</strong> {child.age || 'N/A'}</p>
              <p><strong>Bio:</strong> {child.bio || 'No bio available.'}</p>
              <p><strong>Education Status:</strong> {child.educationStatus || 'N/A'}</p>
              <p><strong>Health Status:</strong> {child.healthStatus || 'N/A'}</p>
              <p><strong>Hobbies:</strong> {child.hobbies || 'No hobbies listed.'}</p>
              <p><strong>Educational Needs:</strong> {child.educationalNeeds || 'No needs listed.'}</p>
              <p><strong>Created By:</strong> {child.createdBy || 'N/A'}</p>
              <div className="mt-2 flex space-x-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => setEditChildId(child.$id)} 
                >
                  Edit Profile
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleDelete(child.$id)}
                >
                  Delete Profile
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {editChildId && (
        <EditChildProfile 
          childId={editChildId} 
          onClose={handleCloseEdit} 
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default ChildrenProfile;
