
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
import { ToastContainer } from 'react-toastify';
import 'animate.css';
import 'react-toastify/dist/ReactToastify.css';
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
import React from 'react';


const App = () => {
    

 

    return (
        
        <div className="min-h-screen bg-gray-50">
            {/* <UserProfile /> */}
            <Routes>
                
                <Route path='/card' element = {<Details />}   />
                <Route path="/orphanage" element={<OrphanagePage />} />
                <Route path="/donation-details" element={<GoodsDonationPage />} />

                <Route path="/goods" element={<GoodsDonationPage />} />
                <Route path="/role" element={<UserRoleHandler />} />
                <Route path="/board" element={<DonorDashboard/>} />
                <Route path="/notice" element={<ContactOrphanageNotice />} />
                <Route path='/user-profeile' element = {<UserProfile />} />
                <Route path='/request' element = {<VolunteerRequestForm />} />
                
                    
                    <Route path="/" element={<Landing />} />
                <Route path="/opportunity" element={<CreateOpportunityForm />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/volunteer-form" element={<VolunteerForm />} />
                    <Route path="/children-page" element={<ChildrenProfile childId={''} />} />
                    <Route path="/child" element={<ChildrenPage />} />
                    <Route path="/volunteer" element={<VolunteerPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/volunteers" element={<VolunteerProfilesPage volunteers={[]} />} /> 
                    <Route path="/volunteer-details/:id" element={<VolunteerDetail volunteerId={''} onClose={function (): void {
                    throw new Error('Function not implemented.');
                } } />} /> 
                <Route path="/create-child-profile" element={<CreateChildProfile volunteerId={null} />} />
                <Route path='/edit-child' element ={<EditChildProfile childId={''} onClose={function (): void {
                    throw new Error('Function not implemented.');
                } } />} />
                    
                </Routes>
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            </div>
        
    );
};

export default App;
