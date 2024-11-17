import { useState, useEffect } from 'react';
import { Databases } from 'appwrite';
import { client } from '../AppwriteService';
import { toast } from 'react-toastify';
import Loader from '../components/shared/Loader';
import React from 'react';

const databases = new Databases(client);

interface ChildProfile {
  name: string;
  age?: number;
  bio: string;
  educationStatus: string;
  healthStatus: string;
  hobbies: string[];
  createdBy: string | null;
  photoUrl: string | null;
}

interface EditChildProfileProps {
  childId: string;
  onClose: () => void;
}

const EditChildProfile: React.FC<EditChildProfileProps> = ({ childId, onClose }) => {
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const databaseId = import.meta.env.VITE_DATABASE_ID;
  const collectionId = import.meta.env.VITE_CHILDREN_COLLECTION_ID;

  useEffect(() => {
    fetchChildProfile();
  }, [childId]);

  const fetchChildProfile = async () => {
    setIsLoading(true);
    try {
      const response = await databases.getDocument(databaseId, collectionId, childId);
      const fetchedProfile: ChildProfile = {
        name: response.name || '',
        age: response.age || undefined,
        bio: response.bio || '',
        educationStatus: response.educationStatus || '',
        healthStatus: response.healthStatus || '',
        hobbies: response.hobbies || [],
        createdBy: response.createdBy || null,
        photoUrl: response.photoUrl || null,
      };
      setChildProfile(fetchedProfile);
    } catch (error) {
      console.error("Error fetching child profile:", error);
      toast.error('Failed to fetch child profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof ChildProfile
  ) => {
    if (!childProfile) return;
    const value = field === 'age' ? Number(e.target.value) : e.target.value;
    setChildProfile({ ...childProfile, [field]: value });
  };

  const handleHobbiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (childProfile) {
      const hobbiesArray = e.target.value.split(',').map(hobby => hobby.trim());
      setChildProfile({ ...childProfile, hobbies: hobbiesArray });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (childProfile) {
      setIsSubmitting(true); // Show the loader during the submit process
      try {
        await databases.updateDocument(databaseId, collectionId, childId, childProfile);
        toast.success("Child profile updated!");
        onClose();
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Error updating profile");
      } finally {
        setIsSubmitting(false); // Hide the loader after submission is complete
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
        >
          ✕
        </button>
        {isLoading ? (
          <p>Loading...</p> 
        ) : childProfile ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Edit Child Profile</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                value={childProfile.name}
                onChange={(e) => handleInputChange(e, 'name')}
                required
                className="border p-2 rounded w-full"
                placeholder="Name"
              />
              <input
                type="number"
                value={childProfile.age || ''}
                onChange={(e) => handleInputChange(e, 'age')}
                className="border p-2 rounded w-full"
                placeholder="Age"
              />
              <textarea
                value={childProfile.bio}
                onChange={(e) => handleInputChange(e, 'bio')}
                required
                className="border p-2 rounded w-full"
                placeholder="Bio"
              />
              <input
                type="text"
                value={childProfile.educationStatus}
                onChange={(e) => handleInputChange(e, 'educationStatus')}
                className="border p-2 rounded w-full"
                placeholder="Education Status"
              />
              <input
                type="text"
                value={childProfile.healthStatus}
                onChange={(e) => handleInputChange(e, 'healthStatus')}
                className="border p-2 rounded w-full"
                placeholder="Health Status"
              />
              <input
                type="text"
                value={childProfile.hobbies.join(', ')}
                onChange={handleHobbiesChange}
                className="border p-2 rounded w-full"
                placeholder="Enter hobbies separated by commas"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  disabled={isSubmitting} 
                >
                  Save Changes
                </button>
                <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <p>No profile data available</p>
        )}

        {isSubmitting && (
          <div className="absolute inset-0 bg-opacity-50 bg-gray-800 flex justify-center items-center z-50">
            <Loader /> {/* Show the loader during submission */}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditChildProfile;
