import React from 'react';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    role: string | null;
    requiredRole: string;
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, requiredRole, children }) => {
    if (role !== requiredRole) {
        return <Navigate to="/unauthorized" />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;
