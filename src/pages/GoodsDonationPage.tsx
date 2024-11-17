import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { databases } from '../AppwriteService';

const GoodsDonationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedOrphanage, setSelectedOrphanage] = useState('');
  const [donationItems, setDonationItems] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const notifySuccess = () => toast.success('Donation saved successfully!');
  const notifyError = () => toast.error('Error saving donation. Please try again.');

  const handleDonateClick = async () => {
    setLoading(true);
    try {
      await databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_GOODS_DONATION_ID,
        'unique()',
        {
          orphanage: selectedOrphanage,
          donationItems,
          deliveryDate,
          contactName,
          contactEmail,
        }
      );
      notifySuccess();
      // Reset form fields on successful submission
      setSelectedOrphanage('');
      setDonationItems('');
      setDeliveryDate('');
      setContactName('');
      setContactEmail('');
    } catch (error) {
      console.error('Error saving donation:', error);
      notifyError();
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' },
  };

  const pulse = {
    animate: { scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="space-y-8 p-8 max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-xl"
    >
      <ToastContainer />

      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        className="text-5xl font-extrabold text-blue-600 text-center"
      >
        Welcome to Goods Donation
      </motion.h1>

      <motion.div {...fadeInUp}>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg shadow-lg bg-white focus:outline-none focus:ring focus:border-blue-500"
          value={selectedOrphanage}
          onChange={(e) => setSelectedOrphanage(e.target.value)}
        >
          <option value="">Select an Orphanage</option>
          <option value="orphanage1">Orphanage 1</option>
          <option value="orphanage2">Orphanage 2</option>
        </select>
      </motion.div>

      <motion.textarea
        {...fadeInUp}
        placeholder="Enter the items you wish to donate, such as food, clothes, or books."
        className="w-full p-4 border border-gray-300 rounded-lg shadow-lg bg-white focus:outline-none focus:ring focus:border-blue-500"
        rows={4}
        value={donationItems}
        onChange={(e) => setDonationItems(e.target.value)}
      />

      <motion.input
        {...fadeInUp}
        type="date"
        className="w-full p-3 border border-gray-300 rounded-lg shadow-lg bg-white focus:outline-none focus:ring focus:border-blue-500"
        value={deliveryDate}
        onChange={(e) => setDeliveryDate(e.target.value)}
      />

      <motion.input
        {...fadeInUp}
        type="text"
        placeholder="Your Name"
        className="w-full p-3 border border-gray-300 rounded-lg shadow-lg bg-white focus:outline-none focus:ring focus:border-blue-500"
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
      />

      <motion.input
        {...fadeInUp}
        type="email"
        placeholder="Your Email"
        className="w-full p-3 border border-gray-300 rounded-lg shadow-lg bg-white focus:outline-none focus:ring focus:border-blue-500"
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
      />

      <motion.button
        onClick={handleDonateClick}
        className="w-full flex justify-center items-center bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition shadow-lg"
        disabled={loading}
      >
        {loading ? (
          <PulseLoader color="white" size={20} />
        ) : (
          <motion.span {...pulse}>Donate Goods</motion.span>
        )}
      </motion.button>
    </motion.div>
  );
};

export default GoodsDonationPage;
