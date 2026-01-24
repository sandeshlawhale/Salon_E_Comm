import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <header style={{ padding: '1rem', borderBottom: '1px solid var(--secondary-color)' }}>
                <h1>Salon App Placeholder Header</h1>
            </header>

            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            <footer style={{ padding: '1rem', borderTop: '1px solid var(--secondary-color)', textAlign: 'center' }}>
                <p>&copy; 2026 Salon E-Commerce. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default MainLayout;
