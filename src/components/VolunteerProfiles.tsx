

import React from 'react';
import { Link } from 'react-router-dom';

// Define the Volunteer interface
interface Volunteer {
     $id: string;
     name: string;
     profilePictureUrl: string;
     bio: string;
     skills: string[];
}


interface VolunteerProfilesProps {
     volunteers: Volunteer[];
}


const VolunteerProfiles: React.FC<VolunteerProfilesProps> = ({ volunteers }) => {
     return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {volunteers.map((volunteer) => (
                    <div key={volunteer.$id} className="bg-white p-4 rounded shadow-md border border-gray-200">
                         <img src={volunteer.profilePictureUrl} alt={volunteer.name} className="w-full h-40 object-cover rounded mb-4" />
                         <h3 className="text-xl font-semibold">{volunteer.name}</h3>
                         <p className="text-gray-600">{volunteer.bio}</p>
                         <h4 className="text-lg font-medium mt-2">Skills:</h4>
                         <ul className="list-disc pl-5">
                              {volunteer.skills.map((skill, index) => (
                                   <li key={index} className="text-gray-700">{skill}</li>
                              ))}
                         </ul>
                         <Link
                              to={`/volunteer/${volunteer.$id}`} 
                              className="mt-4 inline-block bg-blue-500 text-white border border-blue-700 px-3 py-1.5 rounded transition duration-300 hover:bg-blue-600 hover:border-blue-800 transform hover:scale-105"
                         >
                              View Profile
                         </Link>
                    </div>
               ))}
          </div>
     );
};

export default VolunteerProfiles;
