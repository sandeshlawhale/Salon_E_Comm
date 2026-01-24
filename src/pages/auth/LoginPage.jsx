import React from 'react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleLogin = (role) => {
        login(role);
        // Redirect based on role
        if (role === ROLES.ADMIN) navigate('/admin/dashboard');
        else if (role === ROLES.AGENT) navigate('/agent/dashboard');
        else if (role === ROLES.USER) navigate('/dashboard');
        else navigate(from);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="p-8 space-y-4 border rounded-lg shadow-lg bg-card text-card-foreground w-96">
                <h1 className="text-2xl font-bold text-center">Salon Login</h1>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => handleLogin(ROLES.USER)}
                        className="p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Login as User
                    </button>
                    <button
                        onClick={() => handleLogin(ROLES.AGENT)}
                        className="p-2 text-white bg-green-600 rounded hover:bg-green-700"
                    >
                        Login as Agent
                    </button>
                    <button
                        onClick={() => handleLogin(ROLES.ADMIN)}
                        className="p-2 text-white bg-red-600 rounded hover:bg-red-700"
                    >
                        Login as Admin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
