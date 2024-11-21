import React, { useState } from 'react';
import { account, client } from '../AppwriteService';
import { Databases } from 'appwrite';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const databases = new Databases(client);

async function fetchUserRole(userId: string) {
  try {
    const response = await databases.getDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID,
      userId
    );
    return response.role;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();
      const userRole = await fetchUserRole(userData.$id);
      if (!userRole) throw new Error('User role not found');
      localStorage.setItem('userRole', userRole);

      switch (userRole) {
        case 'orphanage':
          navigate('/orphanage');
          break;
        case 'donor':
          navigate('/donor-dashboard');
          break;
        case 'volunteer':
          navigate('/home');
          break;
        default:
          navigate('/home');
      }

      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Login failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await account.createRecovery(resetEmail, `${window.location.origin}/reset-password`);
      toast.success('Password reset email sent!');
      setShowReset(false);
    } catch (error) {
      toast.error('Error: ' + (error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Motion container for page load animation */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-6 text-center text-gray-800"
        >
          Login
        </motion.h1>
        <form onSubmit={handleLogin}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative mb-4"
          >
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative mb-6"
          >
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </motion.div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition duration-200 flex justify-center items-center ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? <PulseLoader color="white" size={10} /> : 'Login'}
          </motion.button>
        </form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-4 text-center text-gray-600"
        >
          <button
            onClick={() => setShowReset(!showReset)}
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </motion.p>

        {showReset && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-4"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handlePasswordReset}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Send Reset Link
            </button>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-4 text-center text-gray-600"
        >
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
