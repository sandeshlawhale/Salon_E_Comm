import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // Replace with a spinner later
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Redirect to their respective dashboard if they try to access a wrong route
        if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'AGENT') return <Navigate to="/agent/dashboard" replace />;
        if (user.role === 'USER') return <Navigate to="/dashboard" replace />;

        return <Navigate to="/" replace />; // Fallback
    }

    return children;
};

export default ProtectedRoute;
