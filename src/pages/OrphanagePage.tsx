import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account, databases } from '../AppwriteService';
import { ID, Query } from 'appwrite';
import React from 'react';
import ContactOrphanageNotice from '../components/ContactOrphanageNotice';

// Orphanage Page Layout
const OrphanagePage: React.FC = () => {
    const navigate = useNavigate();
    const [children, setChildren] = useState<any[]>([]);
    const [volunteers, setVolunteers] = useState<any[]>([]);
    const [childdonation, setChilddonation] = useState<any[]>([]);
    const [opportunities, setOpportunities] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>(''); // State to handle errors


    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const response = await databases.listDocuments(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_VOLUNTEER_OPPORTUNITIES_COLLECTION_ID,
                    [Query.orderAsc('date')] // Optional: order opportunities by date
                );
                setOpportunities(response.documents);
            } catch (err) {
                console.error('Error fetching opportunities:', err);
                setError('Failed to fetch opportunities. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const childrenResponse = await databases.listDocuments(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_CHILDREN_COLLECTION_ID
                );
                setChildren(childrenResponse.documents);

                const volunteersResponse = await databases.listDocuments(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_VOLUNTEER_COLLECTION_ID
                );
                setVolunteers(volunteersResponse.documents);
                const childdonationResponse = await databases.listDocuments(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_CHILD_DONATION_COLLECTION_ID
                );
                setChilddonation(childdonationResponse.documents);
              
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle logout action
    const handleLogout = async () => {
        try {
            await account.deleteSession('current'); // Correct method to delete session (logout)
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleRemoveVolunteer = async (id: string) => {
        try {
            await databases.deleteDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_VOLUNTEER_COLLECTION_ID,
                id
            );
            setVolunteers((prevVolunteers) =>
                prevVolunteers.filter((volunteer) => volunteer.$id !== id)
            );
            alert('Volunteer removed successfully.');
        } catch (error) {
            console.error('Error removing volunteer:', error);
            alert('There was an issue removing the volunteer.');
        }
    };

    const handleToggleAvailability = async (opportunityId: string, currentStatus: boolean) => {
        try {
            const newStatus = !currentStatus;
            await databases.updateDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_VOLUNTEER_OPPORTUNITIES_COLLECTION_ID,
                opportunityId,
                { isAvailable: newStatus }
            );

            setOpportunities((prevOpportunities) =>
                prevOpportunities.map((opportunity) =>
                    opportunity.$id === opportunityId
                        ? { ...opportunity, isAvailable: newStatus }
                        : opportunity
                )
            );

            setSuccessMessage(`Opportunity marked as ${newStatus ? 'Available' : 'Unavailable'}` );
        } catch (err) {
            console.error('Error toggling availability:', err);
            setError('Failed to update availability. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header Section */}
            <header className="bg-blue-600 text-white p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Orphanage Dashboard</h1>
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded-md"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-blue-800 text-white p-4">
                    <h2 className="text-lg font-semibold mb-4">Dashboard Menu</h2>
                    <ul>
                        <li className="mb-2">
                            <button
                                className="w-full text-left px-4 py-2 rounded-md hover:bg-blue-700"
                                onClick={() => navigate('/orphanage')}
                            >
                                Dashboard Overview
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                className="w-full text-left px-4 py-2 rounded-md hover:bg-blue-700"
                                onClick={() => navigate('/children-page')}
                            >
                                Manage Children Profiles
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                className="w-full text-left px-4 py-2 rounded-md hover:bg-blue-700"
                                onClick={() => navigate('/card')}
                            >
                                Manage Volunteers
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                className="w-full text-left px-4 py-2 rounded-md hover:bg-blue-700"
                                onClick={() => navigate('/donation-details')}
                            >
                                View Donations 
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                className="w-full text-left px-4 py-2 rounded-md hover:bg-blue-700"
                                onClick={() => navigate('/notice')}
                            >
                                View Donations 
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                className="mb-4 bg-green-600 text-white px-4 py-2 rounded-md"
                                onClick={() => navigate('/opportunity')}
                            >
                                Create New Opportunity
                            </button>
                        </li>
                    </ul>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6">
                    {/* Dashboard Overview */}
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="font-semibold text-lg">Total Children</h3>
                                <p>{children.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="font-semibold text-lg">Total Volunteers</h3>
                                <p>{volunteers.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="font-semibold text-lg">Total donations for children</h3>
                                <p>{childdonation.length}</p>
                            </div>
                        </div>
                    </section>
                    <section className="mb-6">
        <ContactOrphanageNotice />
    </section>

                    {/* Manage Children Profiles */}
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Manage Children Profiles</h2>
                        {children.length > 0 ? (
                            <ul className="space-y-4">
                                {children.map((child: any) => (
                                    <li key={child.$id} className="bg-white p-4 rounded-lg shadow-md">
                                        <h3 className="font-semibold text-lg">{child.name}</h3>
                                        <p>{child.bio}</p>
                                        <button
                                            className="mt-2 text-blue-600 hover:text-blue-700"
                                            onClick={() => navigate('/edit-child')}
                                        >
                                            Edit Profile
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No children profiles available.</p>
                        )}
                    </section>

                    {/* Manage Volunteers */}
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Manage Volunteers</h2>
                        {volunteers.length > 0 ? (
                            <ul className="space-y-4">
                                {volunteers.map((volunteer: any) => (
                                    <li key={volunteer.$id} className="bg-white p-4 rounded-lg shadow-md">
                                        <h3 className="font-semibold text-lg">{volunteer.name}</h3>
                                        <button
                                            className="mt-2 text-red-600 hover:text-red-700"
                                            onClick={() => handleRemoveVolunteer(volunteer.$id)}
                                        >
                                            Remove Volunteer
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No volunteers available.</p>
                        )}
                    </section>
                     <section className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Donations for children</h2>
                        {childdonation.length > 0 ? (
                            <ul className="space-y-4">
                                {childdonation.map((donation: any) => (
                                    <li key={donation.$id} className="bg-white p-4 rounded-lg shadow-md">
                                        <h3 className="font-semibold text-lg">{donation.childName}</h3>
                                        <p>{donation.amount}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No donations available.</p>
                        )}
                    </section>

                    {/* Manage Opportunities */}
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Manage Opportunities</h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="text-red-600">{error}</p>
                        ) : (
                            <ul className="space-y-4">
                                {opportunities.map((opportunity: any) => (
                                    <li
                                        key={opportunity.$id}
                                        className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                                            <p>{opportunity.description}</p>
                                        </div>
                                        <button
                                            className={`px-4 py-2 rounded-md ${
                                                opportunity.isAvailable ? 'bg-green-600' : 'bg-red-600'
                                            } text-white`}
                                            onClick={() =>
                                                handleToggleAvailability(
                                                    opportunity.$id,
                                                    opportunity.isAvailable
                                                )
                                            }
                                        >
                                            {opportunity.isAvailable ? 'Available' : 'Unavailable'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* Success/Error Message */}
                    {successMessage && (
                        <div className="bg-green-600 text-white p-4 rounded-md mb-4">
                            {successMessage}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-600 text-white p-4 rounded-md mb-4">
                            {error}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default OrphanagePage;
function alert(arg0: string) {
    throw new Error('Function not implemented.');
}

