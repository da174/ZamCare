import React, { useState, useEffect } from 'react';
import { account, client } from '../AppwriteService';
import { Databases } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import { PuffLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const databases = new Databases(client);

const ProfilePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const user = await account.get();
        const response = await databases.getDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_COLLECTION_ID,
          user.$id
        );
        setUsername(response.username);
        setEmail(response.email);
        setRole(response.role);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to fetch user profile.');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <PuffLoader height={30} width={30} color="blue" ariaLabel="loading" />
        </div>
      ) : (
        <form>
          <div className="mb-4">
            <label className="block mb-1">Username</label>
            <p>{username}</p>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <p>{email}</p>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Role</label>
            <p>{role}</p>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
