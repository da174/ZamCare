import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Databases } from 'appwrite';
import { client } from '../AppwriteService';
import { ToastContainer, toast } from 'react-toastify';
import { MdEmail, MdPhone } from 'react-icons/md'; // Import email and phone icons
import EditVolunteerProfile from '../pages/EditVolunteerProfile';

interface VolunteerDetail {
  $id: string;
  name: string;
  profilePictureUrl?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  availability?: boolean;
  email: string;
  phoneNumber?: string;
}

const databases = new Databases(client);

const VolunteerDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [volunteer, setVolunteer] = useState<VolunteerDetail | null>(null); // Now it's a single volunteer
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [preferredContactMethod, setPreferredContactMethod] = useState<string>(''); // State for preferred contact method

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        setIsLoading(true);
        const response = await databases.listDocuments(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_VOLUNTEER_COLLECTION_ID
        );

        const volunteerData = response.documents.map((doc: any) => ({
          $id: doc.$id,
          name: doc.name,
          profilePictureUrl: doc.profilePictureUrl,
          bio: doc.bio,
          skills: doc.skills || [],
          location: doc.location,
          availability: doc.availability,
          email: doc.email,
          phoneNumber: doc.phoneNumber,
        }));

        // Assuming you only want one volunteer (the one selected by ID)
        const selectedVolunteer = volunteerData.find(vol => vol.$id === id); // Find the volunteer by ID
        setVolunteer(selectedVolunteer || null); // Set to null if not found
      } catch (error) {
        console.error('Error fetching volunteer details:', error);
        setError('Could not load volunteer details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolunteer();
  }, [id]); // Adding `id` as a dependency to refetch when the ID changes

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this profile? This action cannot be undone.');
    if (confirmDelete && volunteer) {
      try {
        await databases.deleteDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_VOLUNTEER_COLLECTION_ID,
          id
        );
        setVolunteer(null); // Set volunteer to null after deletion
        toast.success('Profile deleted successfully!');
      } catch (error) {
        console.error('Error deleting profile:', error);
        toast.error('Failed to delete profile. Please try again.');
      }
    }
  };

  const handlePreferredContactChange = (method: string) => {
    setPreferredContactMethod(method);
    toast.info(`Preferred contact method set to ${method === 'email' ? 'Email' : 'Phone'}.`);
  };

 const handleContactVolunteer = () => {
  if (preferredContactMethod === 'email' && volunteer?.email) {
    // Use Gmail's web compose link if mailto fails
    window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${volunteer.email}`;
  } else if (preferredContactMethod === 'phone' && volunteer?.phoneNumber) {
    window.location.href = `tel:${volunteer.phoneNumber}`;
  } else {
    toast.error('Please select a valid contact method and try again.');
  }
};


  const handleCloseEdit = () => {
    setEditId(null);
  };

  if (isLoading) return <p className="text-center mt-6 text-gray-700">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-6">{error}</p>;
  if (!volunteer) return <p className="text-center mt-6 text-gray-700">No volunteer data available.</p>;

  return (
    <div className="flex flex-wrap justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden m-4">
        <div className="relative p-6 text-center bg-indigo-50">
          <button
            onClick={() => window.history.back()}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <img
            src={volunteer.profilePictureUrl}
            alt={volunteer.name}
            className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-indigo-600"
          />
          <h1 className="text-3xl font-bold text-gray-900">{volunteer.name}</h1>
          <p className="text-lg text-gray-700 mt-2">{volunteer.bio}</p>
        </div>

        <div className="p-6 space-y-6 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-indigo-700 font-semibold">Location:</h3>
              <p className="text-gray-800">{volunteer.location}</p>
            </div>
            <div>
              <h3 className="text-indigo-700 font-semibold">Availability:</h3>
              <p className={`font-semibold ${volunteer.availability ? 'text-green-600' : 'text-red-600'}`}>
                {volunteer.availability ? 'Available' : 'Not Available'}
              </p>
            </div>
            <div>
              <h3 className="text-indigo-700 font-semibold">Contact Email:</h3>
              {volunteer.email ? (
                <a href={`mailto:${volunteer.email}`} className="text-blue-500 underline">
                  {volunteer.email}
                </a>
              ) : (
                <p className="text-gray-800">Not provided</p>
              )}
            </div>
            <div>
              <h3 className="text-indigo-700 font-semibold">Phone Number:</h3>
              <p className="text-gray-800">{volunteer.phoneNumber || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-indigo-700 font-semibold">Preferred Communication:</h3>
              <select
                className="bg-gray-200 p-2 rounded text-gray-900 focus:outline-none"
                onChange={(e) => handlePreferredContactChange(e.target.value)}
              >
                <option value="">Select method</option>
                <option value="email">
                  Email <MdEmail className="inline-block ml-2" />
                </option>
                <option value="phone">
                  Phone <MdPhone className="inline-block ml-2" />
                </option>
              </select>
              <button
                onClick={handleContactVolunteer}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Contact Volunteer
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-indigo-700 font-semibold">Skills:</h3>
            <ul className="list-disc list-inside text-gray-800 mt-2 space-y-1">
              {volunteer.skills && volunteer.skills.length > 0 ? (
                volunteer.skills.map((skill, index) => <li key={index}>{skill}</li>)
              ) : (
                <li>No skills listed</li>
              )}
            </ul>
            <div className="mt-2 flex space-x-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setEditId(volunteer.$id)}
              >
                Edit Profile
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDelete(volunteer.$id)}
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {editId && (
        <EditVolunteerProfile id={editId} onClose={handleCloseEdit} />
      )}
      <ToastContainer />
    </div>
  );
};

export default VolunteerDetail;
