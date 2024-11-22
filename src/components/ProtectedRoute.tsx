import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { account } from '../AppwriteService';
import React from 'react';
import {  PuffLoader } from 'react-spinners'; // Import a spinner from react-spinners

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                await account.getSession('current');
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <PuffLoader
 color="#3498db" size={50} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
