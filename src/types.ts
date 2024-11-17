// src/types.ts
export interface Volunteer {
     $id: string; // Appwrite document ID
     name: string;
     profilePictureUrl: string;
     bio: string;
     skills: string[];
     location: string;
     availability: string; // Consider using a boolean or string for specific times
     contactEmail: string;
     phoneNumber: string;
     communicationMethod: string; // e.g., "email", "phone"
}
// src/types/index.ts (or any appropriate file for type definitions)
export interface Session {
     $id: string; // Session ID
     userId: string; // User ID
     // Add other properties as needed based on the Appwrite SDK documentation
}
export interface ChildProfile {
    photoUrl: string | undefined;
    $id: string;
    name: string;
    age?: number;
    bio: string;
    educationStatus: string;
    healthStatus: string;
    hobbies: string[];
    createdBy: string | null;
}

export interface Volunteer {
    $id: string;
    name: string;
}

export interface VolunteerProfile {
    $id: string;
    name: string;
    profilePictureUrl: string;
    bio: string;
    skills: string[];
    location: string;
    availability: string;
}
