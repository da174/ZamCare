import  { useEffect, useState } from 'react';
import { databases } from '../AppwriteService';
import ProfileCard from '../components/ProfileCard';
import { Volunteer } from '../types';
import Modal from '../components/userProfile';
import React from 'react';

const Volunteers: React.FC = () => {
     const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
     const [loading, setLoading] = useState<boolean>(true);
     const [error, setError] = useState<string | null>(null);
     const [searchTerm, setSearchTerm] = useState<string>('');
     const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
     const [page, setPage] = useState<number>(1);
     const [perPage] = useState<number>(10);

     useEffect(() => {
          const fetchVolunteers = async () => {
               setLoading(true);
               try {
                    const response = await databases.listDocuments(
                         process.env.REACT_APP_DATABASE_ID as string,
                         process.env.REACT_APP_VOLUNTEER_COLLECTION_ID as string
                    );
                    // Map response.documents to Volunteer type
                    const volunteersData: Volunteer[] = response.documents.map((doc) => ({
                         $id: doc.$id,
                         name: doc.name,
                         profilePictureUrl: doc.profilePictureUrl,
                         bio: doc.bio,
                         skills: doc.skills || [], // Assuming skills is optional
                         location: doc.location,
                         availability: doc.availability,
                         contactEmail: doc.contactEmail,
                         phoneNumber: doc.phoneNumber,
                         communicationMethod: doc.communicationMethod,
                    }));
                    setVolunteers(volunteersData);
               } catch (err) {
                    setError('Failed to load volunteers');
                    console.error(err);
               } finally {
                    setLoading(false);
               }
          };

          fetchVolunteers();
     }, []);

     const filteredVolunteers = volunteers.filter(volunteer =>
          volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          volunteer.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
     );


     const handleVolunteerClick = (volunteer: Volunteer) => {
          setSelectedVolunteer(volunteer);
     };

     const closeModal = () => {
          setSelectedVolunteer(null);
     };

     if (loading) return <div>Loading...</div>;
     if (error) return <div>{error}</div>;

     return (
          <div className="p-6">
               <h1 className="text-3xl font-bold mb-4">Volunteers</h1>
               <input
                    type="text"
                    placeholder="Search volunteers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4 p-2 border rounded"
               />
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredVolunteers
                         .slice((page - 1) * perPage, page * perPage) // Paginate
                         .map((volunteer) => (
                              <ProfileCard
                                   key={volunteer.$id}
                                   volunteer={volunteer}
                                   onClick={() => handleVolunteerClick(volunteer)} // Pass click handler
                              />
                         ))}
               </div>
               {selectedVolunteer && (
                    <Modal onClose={closeModal} title={''} isOpen={false}>
                         <h2 className="text-xl font-bold">{selectedVolunteer.name}</h2>
                         <p>{selectedVolunteer.bio}</p>
                         <p>Skills: {selectedVolunteer.skills.join(', ')}</p>
                         <p>Location: {selectedVolunteer.location}</p>
                         <p>Contact: {selectedVolunteer.contactEmail || selectedVolunteer.phoneNumber}</p>
                         <button onClick={closeModal} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">
                              Close
                         </button>
                    </Modal>
               )}
               <div className="mt-4">
                    {/* Pagination Controls */}
                    {page > 1 && (
                         <button onClick={() => setPage(page - 1)} className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
                              Previous
                         </button>
                    )}
                    {filteredVolunteers.length > page * perPage && (
                         <button onClick={() => setPage(page + 1)} className="bg-blue-500 text-white px-4 py-2 rounded">
                              Next
                         </button>
                    )}
               </div>
          </div>
     );
};

export default Volunteers;
