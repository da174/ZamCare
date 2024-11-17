import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { account, databases } from '../AppwriteService';  // Assuming AppwriteService is set up
import {  PuffLoader
 } from 'react-spinners';  // Import the spinner component

async function fetchUserRole(userId: string) {
    try {
        const response = await databases.getDocument(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_COLLECTION_ID,
            userId
        );
        return response.role; // Assuming role is directly available in the document
    } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
    }
}

const UserRoleHandler = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);  // Track loading state

    useEffect(() => {
        const getUserRole = async () => {
            try {
                // Step 1: Fetch user data
                const user = await account.get();
                const userId = user.$id;

                // Step 2: Fetch user role from database
                const role = await fetchUserRole(userId);
                if (role) {
                    // Step 3: Save the role in local storage
                    localStorage.setItem('userRole', role);
                    console.log('User Role:', role);

                    // Step 4: Redirect based on the role
                    switch (role) {
                        case 'orphanage':
                            navigate('/orphanage');
                            break;
                        case 'donor':
                            navigate('/board');
                            break;
                        case 'volunteer':
                            navigate('/volunteer');
                            break;
                        default:
                            navigate('/home');
                            break;
                    }
                } else {
                    navigate('/home'); // Redirect to home if role not found
                }
            } catch (error) {
                console.error('Error fetching user role or navigating:', error);
                navigate('/home'); // In case of error, navigate to home
            } finally {
                setIsLoading(false);  // Set loading to false when data is fetched
            }
        };

        getUserRole();
    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            {isLoading ? (
                <PuffLoader size={50} color="#4B90A1" />  // Show spinner while loading
            ) : (
                <div>Redirecting...</div>  // You can add a message if you'd like
            )}
        </div>
    );
};

export default UserRoleHandler;
