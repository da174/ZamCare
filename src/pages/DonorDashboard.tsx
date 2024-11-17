import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom'; // Import Link for navigation
import 'react-toastify/dist/ReactToastify.css';
import ChildDonation from '../components/ChildDonation';
import OrphanageDonation from '../components/OrphanageDonation';

const DonorDashboard = () => {
  const [donationType, setDonationType] = useState<string>(''); // Track selected donation type
  const [recipientType, setRecipientType] = useState<string>(''); // Track recipient type for monetary donations

  // Handle donation type change (Monetary, Goods, or Sponsor)
  const handleDonationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDonationType(e.target.value);
    setRecipientType(''); // Reset recipient type when switching donation type
  };

  // Handle recipient selection (Child or Orphanage) for monetary donations
  const handleRecipientTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRecipientType(e.target.value);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Welcome to Your Donor Dashboard</h1>
      
      {/* Welcoming Message */}
      <p className="text-lg text-gray-600 mb-8 text-center">
        Thank you for your generosity! Your contributions help make a real difference in the lives of children and orphanages in need.
      </p>

      <div className="mb-6">
        <label htmlFor="donationType" className="text-gray-700 font-medium mb-2 block">Select Donation Type:</label>
        <select
          id="donationType"
          value={donationType}
          onChange={handleDonationTypeChange}
          className="w-full p-3 border border-blue-500 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Type</option>
          <option value="monetary">Monetary Donation</option>
          <option value="goods">Goods Donation</option>
          <option value="sponsor">Sponsor a Child</option>
        </select>
      </div>

      {/* Conditional rendering based on donationType */}
      {donationType === 'monetary' && (
        <>
          <div className="mb-6">
            <label htmlFor="recipientType" className="text-gray-700 font-medium mb-2 block">Select Recipient:</label>
            <select
              id="recipientType"
              value={recipientType}
              onChange={handleRecipientTypeChange}
              className="w-full p-3 border border-blue-500 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Recipient</option>
              <option value="child">Child</option>
              <option value="orphanage">Orphanage</option>
            </select>
          </div>

          {/* Conditional rendering based on recipientType */}
          {recipientType === 'child' && <ChildDonation />}
          {recipientType === 'orphanage' && <OrphanageDonation />}
        </>
      )}

      {donationType === 'goods' && (
        <div className="text-center text-gray-600">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">Goods Donation</h3>
          <p>Please contact the orphanage directly for goods donation details. Your support will provide essential supplies to those in need.</p>

          {/* Navigation to Goods Donation Page */}
          <div className="mt-4">
            <Link
              to="/goods"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Go to Goods Donation Details
            </Link>
          </div>
        </div>
      )}

      {donationType === 'sponsor' && (
        <div className="text-center text-gray-600">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">Sponsor a Child</h3>
          <p>If you're interested in sponsoring a child, please get in touch with us to learn more about the children who need your support. Your sponsorship will provide them with the resources to grow and thrive.</p>
        </div>
      )}
     

      <ToastContainer />
    </div>
  );
};

export default DonorDashboard;
