import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { databases, storage } from '../AppwriteService'; // Ensure storage is imported correctly
import { ID } from 'appwrite';
import { ClipLoader } from 'react-spinners';  // To show a loader
import { toast } from 'react-toastify'; // Import toast from React Toastify
import { MdEmail, MdPhone } from 'react-icons/md';

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    profilePictureUrl: z.string(),
    bio: z.string().optional(),
    skills: z.string().optional(),
    location: z.string().optional(),
    availability: z.boolean(),
    email: z.string().email({ message: "Invalid email address." }),
    phoneNumber: z.string().optional(),
    communicationMethod: z.enum(["email", "phone"]),
});

type FormData = z.infer<typeof formSchema>;

const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
        const fileId = `photo_${Date.now()}`;
        const response = await storage.createFile(
            import.meta.env.VITE_BUCKET_ID as string,
            fileId,
            file
        );
        const profilePictureUrl = `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${import.meta.env.VITE_BUCKET_ID}/files/${response.$id}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}&mode=admin`;
        return profilePictureUrl;
    } catch (error) {
        console.error('Error uploading photo:', error);
        return null;
    }
};

const VolunteerForm: React.FC = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
     const [isLoading, setIsLoading] = useState(false);
      const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            profilePictureUrl: "",
            bio: "",
            skills: "",
            location: "",
            availability: false,
            email: "",
            phoneNumber: "",
            communicationMethod: "email",
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);  // Show the loader when starting the submit process
        try {
            const skillsArray = data.skills ? data.skills.split(',').map(skill => skill.trim()) : [];

            if (selectedFile) { // Check if selectedFile is not null
            const uploadedPhotoUrl = await uploadPhoto(selectedFile); // Pass the File object
            if (uploadedPhotoUrl) {
                data.profilePictureUrl = uploadedPhotoUrl;
            }
        }

            await databases.createDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_VOLUNTEER_COLLECTION_ID,
                ID.unique(),
                {
                    ...data,
                    skills: skillsArray,
                }
            );

            toast.success('Volunteer profile created successfully'); // Success toast
        } catch (error) {
            console.error('Error creating volunteer profile:', error);
            toast.error('Error creating volunteer profile'); // Error toast
        } finally {
            setIsLoading(false);  // Hide the loader after process finishes
        }
    };

   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setSelectedFile(file); // Store the file
        handleImagePreview(file);
    }
};

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
        setSelectedFile(file); // Store the file
        handleImagePreview(file);
    }
};


    const handleImagePreview = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
            form.setValue('profilePictureUrl', reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto p-8 bg-gray-900 text-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Create Volunteer Profile</h2>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your Name" {...field} className="text-white bg-gray-800" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Profile Picture Upload - Drag and Drop */}
                <FormField
                    control={form.control}
                    name="profilePictureUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Picture</FormLabel>
                            <FormControl>
                                <div
                                    className="border-2 border-dashed border-gray-500 p-6 text-center cursor-pointer"
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    onClick={() => document.getElementById('imageUploadInput')?.click()}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full mx-auto" />
                                    ) : (
                                        <p>Drag & Drop your image here or click to select</p>
                                    )}
                                    <input
                                        id="imageUploadInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Brief bio" {...field} className="text-white bg-gray-800" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Skills (comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Cooking, Teaching" {...field} className="text-white bg-gray-800" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="City, Country" {...field} className="text-white bg-gray-800" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Available</FormLabel>
                            <FormControl>
                                <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    className="text-white bg-gray-800"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="yourname@example.com" {...field} className="text-white bg-gray-800" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input type="tel" placeholder="e.g., +1234567890" {...field} className="text-white bg-gray-800" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

               <FormField
                    control={form.control}
                    name="communicationMethod"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preferred Communication Method</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="text-white bg-gray-800">
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="email">
                                            <MdEmail className="inline-block mr-2" /> Email
                                        </SelectItem>
                                        <SelectItem value="phone">
                                            <MdPhone className="inline-block mr-2" /> Phone
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-center space-x-4">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {isLoading ? <ClipLoader size={24} color="#fff" /> : 'Submit'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default VolunteerForm;