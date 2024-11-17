import React, { useState } from 'react';
import { account, client } from '../AppwriteService';
import { Databases } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa'; // Import icons

const databases = new Databases(client);

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await account.create('unique()', email, password, username);

      await databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID,
        user.$id,
        {
          username,
          email,
          accountId: user.$id,
          role,
        }
      );

      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

        <div className="relative mb-4">
          <FaUser className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <label className="block mb-2 font-medium text-gray-700">Select Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="donor">Donor</option>
          <option value="volunteer">Volunteer</option>
          <option value="orphanage">Orphanage</option>
        </select>

        <button
          type="submit"
          className="w-full p-3 text-white bg-blue-500 rounded-md flex items-center justify-center transition hover:bg-blue-600 focus:outline-none disabled:bg-gray-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <Oval height={20} width={20} color="white" ariaLabel="loading" />
          ) : (
            "Register"
          )}
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
