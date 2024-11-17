// VolunteerRequestForm.tsx

import React, { useState } from 'react';
import { databases } from '../AppwriteService'; // Import the Appwrite databases instance

const VolunteerRequestForm: React.FC = () => {
    const [volunteerName, setVolunteerName] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await databases.createDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_VOLUNTEER_REQUESTS_COLLECTION_ID,
                'unique()', // Appwrite will generate a unique ID for the document
                {
                    volunteerName,
                    message,
                    status: 'pending',
                    
                }
            );
            setStatus('Request submitted successfully!');
            setVolunteerName('');
            setMessage('');
        } catch (err) {
            console.error('Error submitting request:', err);
            setStatus('Failed to submit request. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold">Submit Volunteer Request</h2>
            {status && <p>{status}</p>}
            <div>
                <label className="block mb-1">Your Name</label>
                <input
                    type="text"
                    value={volunteerName}
                    onChange={(e) => setVolunteerName(e.target.value)}
                    required
                    className="border border-gray-300 p-2 rounded-md w-full"
                />
            </div>
            <div>
                <label className="block mb-1">Message</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="border border-gray-300 p-2 rounded-md w-full"
                ></textarea>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Submit Request
            </button>
        </form>
    );
};

export default VolunteerRequestForm;
