import React from 'react';

const AgentDashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Agent Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 border rounded-lg shadow-sm bg-card">
                    <h3 className="text-sm font-medium text-muted-foreground">My Commission</h3>
                    <p className="mt-2 text-3xl font-bold">$1,234.00</p>
                </div>
                <div className="p-6 border rounded-lg shadow-sm bg-card">
                    <h3 className="text-sm font-medium text-muted-foreground">Assisted Orders</h3>
                    <p className="mt-2 text-3xl font-bold">15</p>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
