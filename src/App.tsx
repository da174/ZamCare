import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VolunteerProfilesPage from './components/VolunteerProfiles';
import VolunteerPage from './pages/VolunteerPage';
import VolunteerForm from './components/VolunteerForm';
import ChildrenProfile from './components/ChildrenProfile';
import CreateChildProfile from './components/CreateChildProfile';
import ChildrenPage from './pages/ChildrenPage';
import CreateOpportunityForm from './components/CreateOpportunityForm';
import EditChildProfile from './pages/EditChildProfile';
import VolunteerDetail from './components/VolunteerDetail';
import UserRoleHandler from './components/UserRoleHandler';
import OrphanagePage from './pages/OrphanagePage';
import Details from './components/Details';
import ContactOrphanageNotice from './components/ContactOrphanageNotice';
import GoodsDonationPage from './pages/GoodsDonationPage';
import VolunteerRequestForm from './components/VolunteerRequestForm';
import DonorDashboard from './pages/DonorDashboard';
import UserProfile from './components/userProfile';
import DonationDetailsPage from './pages/DonationDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'animate.css';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer"
          element={
            <ProtectedRoute>
              <VolunteerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteers"
          element={
            <ProtectedRoute>
              <VolunteerProfilesPage volunteers={[]} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer-form"
          element={
            <ProtectedRoute>
              <VolunteerForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/children-page"
          element={
            <ProtectedRoute>
              <ChildrenPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-child-profile"
          element={
            <ProtectedRoute>
              <CreateChildProfile volunteerId={null} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-child"
          element={
            <ProtectedRoute>
              <EditChildProfile childId={''} onClose={() => {}} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/role"
          element={
            <ProtectedRoute>
              <UserRoleHandler />
            </ProtectedRoute>
          }
        />
        <Route
          path="/board"
          element={
            <ProtectedRoute>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notice"
          element={
            <ProtectedRoute>
              <ContactOrphanageNotice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goods"
          element={
            <ProtectedRoute>
              <GoodsDonationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <DonationDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer-details/:id"
          element={
            <ProtectedRoute>
              <VolunteerDetail volunteerId={''} onClose={() => {}} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/opportunity"
          element={
            <ProtectedRoute>
              <CreateOpportunityForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orphanage"
          element={
            <ProtectedRoute>
              <OrphanagePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
