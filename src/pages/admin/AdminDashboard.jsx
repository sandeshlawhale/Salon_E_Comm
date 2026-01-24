import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-3">
                <div className="p-6 border rounded-lg shadow-sm bg-card">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                    <p className="mt-2 text-3xl font-bold">$45,231.89</p>
                </div>
                <div className="p-6 border rounded-lg shadow-sm bg-card">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Agents</h3>
                    <p className="mt-2 text-3xl font-bold">+2350</p>
                </div>
                <div className="p-6 border rounded-lg shadow-sm bg-card">
                    <h3 className="text-sm font-medium text-muted-foreground">Pending Orders</h3>
                    <p className="mt-2 text-3xl font-bold">+12,234</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
