import React, { useState, useEffect } from 'react';
import { account, databases } from '../AppwriteService'; // Keep the import of AppwriteService as is
import { Query } from 'appwrite'; // Correctly import Query from the appwrite SDK

const CreateOpportunityForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userRole, setUserRole] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpportunityAvailable, setIsOpportunityAvailable] = useState(false);
    const [opportunityId, setOpportunityId] = useState<string>(''); // Store the ID of the opportunity

    useEffect(() => {
        const fetchUserRoleAndOpportunities = async () => {
            try {
                const user = await account.get(); // Fetch current user data
                const userDocument = await databases.getDocument(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_COLLECTION_ID, // Adjust with your collection ID
                    user.$id // Use $id of the logged-in user to fetch the document
                );
                setUserRole(userDocument.role || ''); // Assuming 'role' is part of the user document

                // Fetch the latest opportunity to toggle
                const opportunities = await databases.listDocuments(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_VOLUNTEER_OPPORTUNITIES_COLLECTION_ID,
                    [
                        Query.equal('isAvailable', true) // Correct query format for fetching available opportunities
                    ]
                );
                
                if (opportunities.documents.length > 0) {
                    const opportunity = opportunities.documents[0];
                    setIsOpportunityAvailable(opportunity.isAvailable);
                    setOpportunityId(opportunity.$id); // Set the opportunity ID to update it later
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching user role or opportunities:', err);
                setError('Failed to fetch user role or opportunities. Please try again later.');
                setLoading(false);
            }
        };

        fetchUserRoleAndOpportunities();
    }, []);

    // Toggle the availability of the opportunity
    const handleToggleAvailability = async () => {
        try {
            const newStatus = !isOpportunityAvailable;

            // Update the isAvailable field in the database
            await databases.updateDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_VOLUNTEER_OPPORTUNITIES_COLLECTION_ID,
                opportunityId, // The document ID of the opportunity
                {
                    isAvailable: newStatus
                }
            );
            setIsOpportunityAvailable(newStatus); // Update local state
            setSuccessMessage(`Opportunity is now ${newStatus ? 'Available' : 'Unavailable'}`);
        } catch (err) {
            console.error('Error toggling availability:', err);
            setError('Failed to update availability. Please try again.');
        }
    };

    // Handle form submission to create an opportunity
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Validate input fields
        if (!title || !description || !date || !location) {
            setError('All fields are required.');
            return;
        }

        // Prevent orphanages from creating opportunities
        if (userRole === 'orphanage') 
           

        try {
            // Create the opportunity in the database
            const response = await databases.createDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_VOLUNTEER_OPPORTUNITIES_COLLECTION_ID,
                'unique()',
                {
                    title,
                    description,
                    date,
                    location,
                    isAvailable: true, // Mark as available
                }
            );
            setOpportunityId(response.$id); // Set the ID for this newly created opportunity
            setSuccessMessage('Opportunity created successfully!');
            setTitle('');
            setDescription('');
            setDate('');
            setLocation('');
        } catch (err) {
            console.error('Error creating opportunity:', err);
            setError('Failed to create opportunity. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <div className="max-w-md mx-auto p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Create Volunteer Opportunity</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded p-2"
                        rows={4}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white rounded p-2"
                >
                    Create Opportunity
                </button>
            </form>

            {/* Toggle button to change availability */}
            <div className="mt-4 flex items-center">
                <label className="mr-2">Availability:</label>
                <button
                    onClick={handleToggleAvailability}
                    className={`px-4 py-2 rounded ${
                        isOpportunityAvailable ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}
                >
                    {isOpportunityAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                </button>
            </div>
        </div>
    );
};

export default CreateOpportunityForm;
