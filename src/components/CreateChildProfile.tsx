import { useState } from 'react';
import { Databases, Storage } from 'appwrite';
import { client } from '../AppwriteService';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './shared/Loader';
import { File } from 'lucide-react';
import React from 'react';

const databases = new Databases(client);
const storage = new Storage(client);

interface ChildProfile {
  name: string;
  age?: number;
  bio: string;
  educationStatus: string;
  healthStatus: string;
  hobbies: string[];
  createdBy: string | null;
  photoUrl: string | null; // Add this line
}

const CreateChildProfile: React.FC<{ volunteerId: string | null }> = ({ volunteerId }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | undefined>(undefined);
  const [bio, setBio] = useState('');
  const [educationStatus, setEducationStatus] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [createdBy, setCreatedBy] = useState('');

  const mutation = useMutation({
    mutationFn: async (newProfile: ChildProfile) => {
      try {
        return await databases.createDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_CHILDREN_COLLECTION_ID,
          'unique()',
          newProfile
        );
      } catch (error) {
        console.error("Error creating document:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Child profile created successfully!');
      resetForm();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error('Error creating child profile');
    },
  });

  const handleHobbiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHobbies(e.target.value.split(',').map((hobby) => hobby.trim()));
  };

  const resetForm = () => {
    setName('');
    setAge(undefined);
    setBio('');
    setEducationStatus('');
    setHealthStatus('');
    setHobbies([]);
    setPhotoFile(null);
    setCreatedBy('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedPhotoUrl = null;
    if (photoFile) {
      uploadedPhotoUrl = await uploadPhoto(photoFile);
      if (!uploadedPhotoUrl) {
        toast.error('Error uploading photo');
        return;
      }
    }

    const newProfile: ChildProfile = {
      name,
      age,
      bio,
      educationStatus,
      healthStatus,
      hobbies,
      photoUrl: uploadedPhotoUrl || null, 
      createdBy
    };

    mutation.mutate(newProfile);
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      const fileId = `photo_${Date.now()}`;
      const response = await storage.createFile(
        import.meta.env.VITE_BUCKET_ID as string,
        fileId,
        file
      );
const photoUrl =  `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${import.meta.env.VITE_BUCKET_ID}/files/${response.$id}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}&mode=admin`

      return photoUrl;
      console.log(photoUrl);
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setPhotoFile(acceptedFiles[0]);
      }
    },
  });

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Child's Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 rounded w-3/4"
        />
        <input
          type="number"
          placeholder="Age"
          value={age || ''}
          onChange={(e) => setAge(e.target.value ? Number(e.target.value) : undefined)}
          required
          className="border p-2 rounded w-3/4"
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
          className="border p-2 rounded w-3/4"
        />
        <input
          type="text"
          placeholder="Education Status"
          value={educationStatus}
          onChange={(e) => setEducationStatus(e.target.value)}
          className="border p-2 rounded w-3/4"
        />
        
        <input
          type="text"
          placeholder="Health Status"
          value={healthStatus}
          onChange={(e) => setHealthStatus(e.target.value)}
          className="border p-2 rounded w-3/4"
        />
        <input
          type="text"
          placeholder="Hobbies (comma-separated)"
          value={hobbies.join(', ')}
          onChange={handleHobbiesChange}
          className="border p-2 rounded w-3/4"
        />
        <input
          type="text"
          placeholder="Created By"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          className="border p-2 rounded w-3/4"
        />
        

        {/* Dropzone for photo upload */}
        <div
          {...getRootProps()}
          className={`border border-dashed border-gray-400 rounded p-4 w-3/4 cursor-pointer ${isDragActive ? 'bg-gray-200' : ''}`}
        >
          <input {...getInputProps()} />
          {photoFile ? (
            <p>{photoFile.name}</p>
          ) : (
            <p>{isDragActive ? 'Drop the file here...' : 'Drag and drop a photo here or click to select a file'}</p>
          )}
        </div>

         <div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          // Use your custom Loader component when mutation is pending
          <Loader />
        ) : (
          'Create Child Profile'
        )}
        {mutation.isPending ? 'Creating...' : 'Create Child Profile'}
      </button>
      {mutation.isError && <p className="text-red-500">Error creating profile</p>}
      {mutation.isSuccess && <p className="text-green-500">Profile created!</p>}
    </div>
      </form>
    </div>
  );
};

export default CreateChildProfile;