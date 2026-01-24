import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
            <div className="p-6 border rounded-lg shadow-sm bg-card">
                <h2 className="mb-4 text-xl font-semibold">Recent Orders</h2>
                <p className="text-muted-foreground">No orders found.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-card">
                <h2 className="mb-4 text-xl font-semibold">Saved Addresses</h2>
                <p className="text-muted-foreground">No addresses saved.</p>
            </div>
        </div>
    );
};

export default UserDashboard;
