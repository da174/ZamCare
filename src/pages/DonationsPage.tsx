import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaDonate, FaChild, FaEnvelope, FaHeart, FaBook, FaGift, FaHandHoldingHeart } from 'react-icons/fa';
import SponsorshipPage from './SponsorshipPage';
import GoodsDonationPage from './GoodsDonationPage';

const DonationsPage: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <nav className="relative bg-blue-600 p-4 md:w-1/4 flex flex-col items-center md:items-start">
        <Link to="/" className="flex items-center text-white bg-blue-600 text-lg font-bold mb-4">
          <img src="/assets/k__2.png" alt="ZamCare Logo" className="h-16 w-16 mr-2" /> 
          ZamCare
        </Link>

        <div className="space-y-2 w-full">
          <Link to="/home" className="text-white bg-blue-600 flex items-center border border-white rounded-lg px-3 py-2 w-3/4 mx-auto transition duration-300 hover:bg-white hover:text-blue-600 transform hover:scale-105">
            <FaHome className="mr-2" /> Home
          </Link>
          <Link to="/sponsor" className="text-white bg-blue-600 flex items-center border border-white rounded-lg px-3 py-2 w-3/4 mx-auto transition duration-300 hover:bg-white hover:text-blue-600 transform hover:scale-105">
            <FaHandHoldingHeart className="mr-2" /> Sponsorship
          </Link>
          <Link to="/goods" className="text-white bg-blue-600 flex items-center border border-white rounded-lg px-3 py-2 w-3/4 mx-auto transition duration-300 hover:bg-white hover:text-blue-600 transform hover:scale-105">
            <FaGift className="mr-2" /> Goods Donation
          </Link>
          <Link to="/child" className="text-white bg-blue-600 flex items-center border border-white rounded-lg px-3 py-2 w-3/4 mx-auto transition duration-300 hover:bg-white hover:text-blue-600 transform hover:scale-105">
            <FaChild className="mr-2" /> Our Children
          </Link>
          <Link to="/contact" className="text-white bg-blue-600 flex items-center border border-white rounded-lg px-3 py-2 w-3/4 mx-auto transition duration-300 hover:bg-white hover:text-blue-600 transform hover:scale-105">
            <FaEnvelope className="mr-2" /> Contact
          </Link>
        </div>
      </nav>

      {/* Main Content for Donations */}
      <div className="flex flex-col md:flex-row flex-grow bg-gray-100">
        {/* Donations Section */}
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-800">Support Our Cause</h1>
            <p className="text-lg text-gray-600">Your generous contributions help make a difference!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Monetary Donations Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Monetary Donations</h2>
              <p className="text-gray-600 mb-4">Make a financial contribution to help us support orphanages and children in need.</p>
              <MonetaryDonation />
            </div>

            {/* Child Sponsorship Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Child Sponsorship</h2>
              <p className="text-gray-600 mb-4">Sponsor a child and provide for their education, healthcare, and future.</p>
              <SponsorshipPage />
            </div>

            {/* Goods Donations Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Donate Goods</h2>
              <p className="text-gray-600 mb-4">Donate essential items like clothes, food, and educational materials to orphanages.</p>
              <GoodsDonationPage />
            </div>
          </div>
        </main>

        {/* Sidebar for Our Impact (Visible on larger screens) */}
        <aside className="hidden md:block md:w-1/3 p-4 bg-blue-100 rounded shadow-lg h-full">
          <h2 className="text-xl font-bold mb-2">Our Impact</h2>
          <p className="text-sm mb-4">We have helped over 100 children in need and continue to strive for a better future for every child.</p>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FaHeart className="mr-2" /> Get Involved
          </h3>
          <p className="text-sm mb-4">Join us in making a difference. Check out our volunteer opportunities!</p>
          <Link to="/volunteer" className="bg-blue-500 text-white px-3 py-1.5 rounded transition duration-300 hover:bg-blue-600 transform hover:scale-105">
            Volunteer
          </Link>
          <h3 className="text-lg font-semibold mt-8 mb-2 flex items-center">
            <FaBook className="mr-2" /> Educational Resources
          </h3>
          <p className="text-sm">Access our resources to help children with their education.</p>
          <Link to="/success-stories" className="mt-4 text-blue-600 underline">More Success Stories</Link>
        </aside>
      </div>
    </div>
  );
};

export default DonationsPage;
