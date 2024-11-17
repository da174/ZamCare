import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

interface ProfileCardProps {
     name: string;
     profilePictureUrl: string;
     bio: string;
     skills: string[];
     location: string;
     availability: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
     name,
     profilePictureUrl,
     bio,
     skills,
     location,
     availability,
}) => (
     <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-2xl transition duration-300 ease-in-out">
          {/* Profile Picture */}
          <div className="flex justify-center mb-4">
               <img
                    src={profilePictureUrl}
                    alt={`${name}'s profile`}
                    className="rounded-full w-28 h-28 border-4 border-blue-500 shadow-sm"
               />
          </div>

          {/* Name */}
          <h3 className="text-xl font-bold text-center text-gray-800 mb-2">{name}</h3>

          {/* Bio */}
          <p className="text-gray-600 text-center mb-4 px-4 text-sm">
               {bio.length > 100 ? `${bio.substring(0, 100)}...` : bio}
          </p>

          {/* Location and Availability */}
          <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
               <div className="flex items-center space-x-1">
                    <FaMapMarkerAlt />
                    <span>{location}</span>
               </div>
               <div className="flex items-center space-x-1">
                    <FaClock />
                    <span>{availability}</span>
               </div>
          </div>

          {/* Skills */}
          <div className="mt-4">
               <h4 className="text-sm font-semibold text-gray-700">Skills</h4>
               <ul className="flex flex-wrap mt-2 space-x-2">
                    {skills.map((skill, index) => (
                         <li
                              key={index}
                              className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium"
                         >
                              {skill}
                         </li>
                    ))}
               </ul>
          </div>
     </div>
);

export default ProfileCard;