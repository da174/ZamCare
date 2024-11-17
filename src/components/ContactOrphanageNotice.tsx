import React, { useState, useEffect } from 'react';
import { databases } from '../AppwriteService'; // Make sure to import the Appwrite databases instance

const ContactOrphanageNotice: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [error, setError] = useState<string>('');

    // Fetch pending requests
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await databases.listDocuments(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_VOLUNTEER_REQUESTS_COLLECTION_ID, // Create a collection for requests
                );
                setRequests(response.documents);
            } catch (err) {
                console.error('Error fetching requests:', err);
                setError('Failed to fetch requests. Please try again later.');
            }
        };

        fetchRequests();
    }, []);

    const handleApproval = async (requestId: string, approve: boolean) => {
        try {
            await databases.updateDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_VOLUNTEER_REQUESTS_COLLECTION_ID,
                requestId,
                { status: approve ? 'approved' : 'rejected' }
            );
            setRequests((prevRequests) =>
                prevRequests.filter((request) => request.$id !== requestId)
            );
        } catch (err) {
            console.error('Error updating request:', err);
            setError('Failed to update request status. Please try again.');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Volunteer Requests</h2>
            {error && <p className="text-red-600">{error}</p>}
            <ul className="space-y-4">
                {requests.map((request) => (
                    <li key={request.$id} className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="font-semibold">{request.volunteerName}</h3>
                        <p>{request.message}</p>
                        <div className="mt-4 flex space-x-4">
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-md"
                                onClick={() => handleApproval(request.$id, true)}
                            >
                                Approve
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-md"
                                onClick={() => handleApproval(request.$id, false)}
                            >
                                Reject
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactOrphanageNotice;
