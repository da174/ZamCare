import React, { useEffect, useState } from 'react';
import { databases } from '../AppwriteService'; // Adjust the import path to your Appwrite SDK utils
import { BeatLoader } from 'react-spinners';
import { motion } from 'framer-motion';

const DonationDetailsPage = () => {
  const [childDonations, setChildDonations] = useState<any[]>([]);
  const [orphanageDonations, setOrphanageDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDonationDetails = async () => {
      setLoading(true);
      try {
        // Fetch child donations
        const childResponse = await databases.listDocuments(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_CHILD_DONATION_COLLECTION_ID
        );
        setChildDonations(childResponse.documents);

        // Fetch orphanage donations
        const orphanageResponse = await databases.listDocuments(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_ORPHANAGE_DONATION_COLLECTION_ID
        );
        setOrphanageDonations(orphanageResponse.documents);
      } catch (err) {
        setError('Error fetching donation data');
      } finally {
        setLoading(false);
      }
    };

    fetchDonationDetails();
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-100 via-white to-blue-200 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl font-extrabold text-center text-blue-800 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Donation Details
        </motion.h1>

        {/* Show Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center">
            <BeatLoader size={10} color="#3498db" />
          </div>
        )}

        {/* Show Error Message */}
        {error && (
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        )}

        {/* Donation Sections */}
        {!loading && !error && (childDonations.length > 0 || orphanageDonations.length > 0) && (
          <div className="space-y-12">
            <motion.div
              className="transition-all ease-in-out"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-semibold text-blue-600 mb-6">Child Donations</h2>
              {childDonations.length === 0 ? (
                <div className="text-center text-gray-600">No child donations found.</div>
              ) : (
                childDonations.map((donation: any) => (
                  <motion.div
                    key={donation.$id}
                    className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-xl font-semibold text-blue-600 mb-4">
                      Donation to {donation.childName}
                    </h3>
                    <div className="mb-4"><strong>Amount:</strong> ${donation.amount}</div>
                    <div className="mb-4"><strong>Donor Name:</strong> {donation.donorName}</div>
                    <div className="mb-4"><strong>Donor Email:</strong> {donation.donorEmail}</div>
                    <div className="mb-4"><strong>Receipt ID:</strong> {donation.receiptId}</div>
                    <div className="mb-4"><strong>Comment:</strong> {donation.comment || 'No comment provided'}</div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Orphanage Donations Section */}
            <motion.div
              className="transition-all ease-in-out"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-semibold text-blue-600 mb-6">Orphanage Donations</h2>
              {orphanageDonations.length === 0 ? (
                <div className="text-center text-gray-600">No orphanage donations found.</div>
              ) : (
                orphanageDonations.map((donation: any) => (
                  <motion.div
                    key={donation.$id}
                    className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-xl font-semibold text-blue-600 mb-4">
                      Donation to {donation.orphanageName}
                    </h3>
                    <div className="mb-4"><strong>Amount:</strong> ${donation.amount}</div>
                    <div className="mb-4"><strong>Donor Name:</strong> {donation.donorName}</div>
                    <div className="mb-4"><strong>Donor Email:</strong> {donation.donorEmail}</div>
                    <div className="mb-4"><strong>Receipt ID:</strong> {donation.receiptId}</div>
                    <div className="mb-4"><strong>Comment:</strong> {donation.comment || 'No comment provided'}</div>
                    <div className="mb-4"><strong>City:</strong> {donation.donorCity}</div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationDetailsPage;
