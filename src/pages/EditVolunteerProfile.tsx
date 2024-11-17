import { useState, useEffect } from 'react';
import { Databases, Storage } from 'appwrite';
import { client } from '../AppwriteService';
import { toast } from 'react-toastify';
import Loader from '../components/shared/Loader';
import React from 'react';

const databases = new Databases(client);
const storage = new Storage(client);

interface VolunteerProfile {
  name: string;
  email: string;
  bio: string;
  skills: string[];
  availability: boolean;
  profilePictureUrl?: string; 
}

interface EditVolunteerProfileProps {
  id: string;
  onClose: () => void;
}

const EditVolunteerProfile: React.FC<EditVolunteerProfileProps> = ({ id, onClose }) => {
  const [volunteerProfile, setVolunteerProfile] = useState<VolunteerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const databaseId = import.meta.env.VITE_DATABASE_ID;
  const collectionId = import.meta.env.VITE_VOLUNTEER_COLLECTION_ID;

  useEffect(() => {
    fetchVolunteerProfile();
  }, [id]);

  const fetchVolunteerProfile = async () => {
    setIsLoading(true);
    try {
      const response = await databases.getDocument(databaseId, collectionId, id);
      setVolunteerProfile({
        name: response.name || '',
        email: response.email || '',
        bio: response.bio || '',
        skills: response.skills || [],
        availability: response.availability === 'true',
        profilePictureUrl: response.profileImage || '',
      });
    } catch (error) {
      console.error("Error fetching volunteer profile:", error);
      toast.error('Failed to fetch volunteer profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof VolunteerProfile
  ) => {
    if (!volunteerProfile) return;

    let value;
    if (e.target.type === 'checkbox' && field === 'availability') {
      value = e.target.checked;
    } else if (field === 'skills') {
      value = e.target.value.split(',').map(skill => skill.trim());
    } else {
      value = e.target.value;
    }
    setVolunteerProfile({ ...volunteerProfile, [field]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = volunteerProfile?.profilePictureUrl || '';

      if (imageFile) {
        const response = await storage.createFile(
          import.meta.env.VITE_BUCKET_ID,
          'unique()',
          imageFile,
        );

        // Generate URL using file ID and save it
        imageUrl = storage.getFileView(import.meta.env.VITE_BUCKET_ID, response.$id);
      }

      const updatedProfile = { 
        ...volunteerProfile, 
        profilePictureUrl: imageUrl, 
        availability: volunteerProfile.availability 
      };

      await databases.updateDocument(databaseId, collectionId, id, updatedProfile);

      toast.success("Volunteer profile updated!");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {isLoading ? (
          <Loader />
        ) : volunteerProfile ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Edit Volunteer Profile</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                value={volunteerProfile.name}
                onChange={(e) => handleInputChange(e, 'name')}
                required
                className="border p-2 rounded w-full"
                placeholder="Name"
              />
              <input
                type="email"
                value={volunteerProfile.email}
                onChange={(e) => handleInputChange(e, 'email')}
                required
                className="border p-2 rounded w-full"
                placeholder="Email"
              />
              <textarea
                value={volunteerProfile.bio}
                onChange={(e) => handleInputChange(e, 'bio')}
                required
                className="border p-2 rounded w-full"
                placeholder="Bio"
              />
              <input
                type="text"
                value={volunteerProfile.skills.join(', ')}
                onChange={(e) => handleInputChange(e, 'skills')}
                className="border p-2 rounded w-full"
                placeholder="Enter skills separated by commas"
              />
              <input
                type="checkbox"
                checked={volunteerProfile.availability}
                onChange={(e) => handleInputChange(e, 'availability')}
                className="border p-2 rounded"
              />
              <div>
                <label className="block mb-2">Profile Image</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="border p-2 rounded w-full"
                />
              </div>
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
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditVolunteerProfile;
