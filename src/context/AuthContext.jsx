import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    AGENT: 'AGENT'
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating session check
        const storedUser = localStorage.getItem('salon_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (role) => {
        // Mock login logic
        const mockUser = {
            id: '123',
            name: `Test ${role}`,
            email: `test${role.toLowerCase()}@example.com`,
            role: role
        };
        setUser(mockUser);
        localStorage.setItem('salon_user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('salon_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, roles: ROLES }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
