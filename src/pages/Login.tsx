import React, { useState } from 'react';
import { account, client } from '../AppwriteService';
import { Databases } from 'appwrite';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const databases = new Databases(client);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false); // State for showing password reset
  const [resetEmail, setResetEmail] = useState(''); // State for reset email input
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const userData = await account.get();
      const userDocument = await databases.getDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID,
        userData.$id
      );
      const userRole = userDocument.role;
      localStorage.setItem('userRole', userRole);

      switch (userRole) {
        case 'orphanage':
          navigate('/orphanage');
          break;
        case 'donor':
          navigate('/donor-dashboard');
          break;
        case 'volunteer':
          navigate('/volunteer');
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
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="relative mb-4">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="relative mb-6">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition duration-200 flex justify-center items-center ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? <PulseLoader color="white" size={10} /> : 'Login'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-gray-600">
          <button
            onClick={() => setShowReset(!showReset)}
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </p>

        {showReset && (
          <div className="mt-4">
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
          </div>
        )}

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
