import React, { useState, useEffect } from 'react';
import { account, client } from '../AppwriteService';
import { Databases } from 'appwrite';
import { useNavigate } from 'react-router-dom';

const databases = new Databases(client);

const UserProfile: React.FC = () => {
  const [username, setUsername] = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await account.get();
        const response = await databases.getDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_COLLECTION_ID,
          user.$id
        );
        setUsername(response.username);
        setRole(response.role);

        // Set initials (first letter of first and last name)
        const nameParts = response.username.split(' ');
        const initials = nameParts
          .map((part: string) => part.charAt(0).toUpperCase())
          .join('');
        setUserInitials(initials);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  return (
    <div className="fixed top-0 right-0 p-4 flex justify-between items-center w-full bg-white shadow-md z-10">
      <div className="text-lg font-semibold">Welcome, {username}</div>

      {/* User initials in a rounded badge */}
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full">
          {userInitials}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
