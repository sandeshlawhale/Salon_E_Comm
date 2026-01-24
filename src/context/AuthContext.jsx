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

    const login = (email, password, role) => {
        // Mock login logic with persistence check
        const storedUsers = JSON.parse(localStorage.getItem('salon_users') || '[]');
        const registeredUser = storedUsers.find(u => u.email === email && u.password === password);

        if (registeredUser) {
            const userSession = { ...registeredUser, role: registeredUser.role || role }; // Fallback to passed role if missing
            setUser(userSession);
            localStorage.setItem('salon_user', JSON.stringify(userSession));
            return true;
        }

        // Allow "Test" logins if not found in DB for dev convenience (optional, maybe distinct behavior?)
        // Let's force registration for "better auth" feel, OR allow generic admin/agent bypass.
        // For now, let's allow the generic bypass if specific email matches "test" convention, else require registration.
        if (email.startsWith('test')) {
            const mockUser = {
                id: '123',
                name: `Test ${role}`,
                email: email,
                role: role
            };
            setUser(mockUser);
            localStorage.setItem('salon_user', JSON.stringify(mockUser));
            return true;
        }

        return false;
    };

    const register = (userData) => {
        const storedUsers = JSON.parse(localStorage.getItem('salon_users') || '[]');
        if (storedUsers.some(u => u.email === userData.email)) {
            return { success: false, message: 'User already exists' };
        }

        const newUser = { ...userData, id: Date.now().toString() };
        storedUsers.push(newUser);
        localStorage.setItem('salon_users', JSON.stringify(storedUsers));

        // Auto login after register
        setUser(newUser);
        localStorage.setItem('salon_user', JSON.stringify(newUser));
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('salon_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading, roles: ROLES }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
