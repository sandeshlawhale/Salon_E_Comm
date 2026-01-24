import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, ShoppingBag, LogOut, Home } from 'lucide-react';

const UserDashboardLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="container px-4 py-8 mx-auto">
            <div className="flex flex-col gap-8 md:flex-row">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="sticky top-4 space-y-4">
                        <div className="p-4 border rounded-lg shadow-sm bg-card border-border">
                            <h2 className="mb-4 text-lg font-semibold">My Account</h2>
                            <nav className="space-y-2">
                                <Link to="/" className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                                    <Home className="w-4 h-4" />
                                    Shop Home
                                </Link>
                                <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                                    <User className="w-4 h-4" />
                                    Profile
                                </Link>
                                <Link to="/dashboard/orders" className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                                    <ShoppingBag className="w-4 h-4" />
                                    Orders
                                </Link>
                                <button onClick={handleLogout} className="flex items-center w-full gap-3 px-4 py-2 text-sm font-medium text-red-500 rounded-md hover:bg-red-50 hover:text-red-600">
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-h-[500px]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserDashboardLayout;
