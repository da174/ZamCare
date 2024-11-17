import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Query } from 'appwrite';
import { databases } from '@/AppwriteService';

interface Volunteer {
  email: any;
  $id: string;
  name: string;
  profilePictureUrl: string;
  bio: string;
  skills: string[];
  location: string;
  availability: string;
  phoneNumber: string;
}

interface VolunteerCardProps {
  id: string;  // Pass volunteerId to fetch the specific volunteer's data
}

const VolunteerCard: React.FC<VolunteerCardProps> = ({ id }) => {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state

  // Fetch volunteer data by volunteerId
  const fetchVolunteerProfile = async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_VOLUNTEER_COLLECTION_ID,
        [
          Query.equal('$id', id) // Fetch the volunteer with the matching ID
        ]
      );

      if (response.documents.length > 0) {
        setVolunteer(response.documents[0] as unknown as Volunteer);
      }
    } catch (error) {
      console.error('Error fetching volunteer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteerProfile();
  }, [id]); // Re-run if volunteerId changes

  if (loading) {
    return <div>Loading...</div>;  // Simple loading state
  }

  if (!volunteer) {
    return <div>Volunteer not found.</div>;  // Handle case where volunteer is not found
  }

  // ProfileCard component to display volunteer info
  const ProfileCard = ({
    name,
    profilePictureUrl,
    bio,
    skills,
    location,
    availability,
    email,
    phoneNumber
  }: Volunteer) => {
    return (
      <div className="profile-card">
        <img src={profilePictureUrl} alt={name} className="w-24 h-24 rounded-full" />
        <h3>{name}</h3>
        <p>{bio}</p>
        <p>Skills: {skills.join(', ')}</p>
        <p>Location: {location}</p>
        <p>Availability: {availability}</p>
        <p>Email: {email}</p>
        <p>Phone: {phoneNumber}</p>
      </div>
    );
  };

  return (
    <motion.div
      className="bg-white p-4 rounded shadow-md border border-gray-200 max-w-md mx-auto"
      whileHover={{ scale: 1.05 }}
    >
      <img
        src={volunteer.profilePictureUrl}
        alt={volunteer.name}
        className="w-full h-48 object-cover rounded mb-2"
      />
      <h3 className="text-xl font-semibold">{volunteer.name}</h3>
      <p className="text-sm">{volunteer.bio || 'No bio available.'}</p>
      <p className="text-sm mb-2">Location: {volunteer.location}</p>
      {/* Optional: Add a link to view more details or any other functionality */}
      <a 
        href={`/volunteer-details/${volunteer.$id}`} 
        className="mt-2 bg-blue-500 text-white px-3 py-1.5 rounded transition duration-300 hover:bg-blue-600 transform hover:scale-105"
      >
        View Full Profile
      </a>

      {/* Use ProfileCard to display volunteer details */}
      <ProfileCard
                 name={volunteer.name}
                 profilePictureUrl={volunteer.profilePictureUrl}
                 bio={volunteer.bio}
                 skills={volunteer.skills}
                 location={volunteer.location}
                 availability={volunteer.availability}
                 email={volunteer.email}
                 phoneNumber={volunteer.phoneNumber}
                 id={ volunteer.$id} />
    </motion.div>
  );
};

export default VolunteerCard;
