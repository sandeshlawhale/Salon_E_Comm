import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, Users, LogOut } from 'lucide-react';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card">
                <div className="p-6 border-b border-border">
                    <h1 className="text-xl font-bold text-primary">Salon Admin</h1>
                </div>
                <nav className="p-4 space-y-2">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Link>
                    <Link to="/admin/products" className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                        <Package className="w-4 h-4" />
                        Products
                    </Link>
                    <Link to="/admin/agents" className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                        <Users className="w-4 h-4" />
                        Agents
                    </Link>
                    <button onClick={handleLogout} className="flex items-center w-full gap-3 px-4 py-2 text-sm font-medium text-red-500 rounded-md hover:bg-red-50 hover:text-red-600">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
