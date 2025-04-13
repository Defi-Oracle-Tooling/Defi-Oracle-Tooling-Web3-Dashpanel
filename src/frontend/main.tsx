import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import global styles first
import './styles/global.css';

// Import Page Components
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';

// Basic App structure with routing
const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/user" element={<UserPage />} />
            {/* Default route redirects to /user */}
            <Route path="/" element={<Navigate to="/user" replace />} />
            {/* Add a 404 or catch-all route if desired */}
            {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
        </Routes>
    </BrowserRouter>
);

// Find the root container
const container = document.getElementById('root');

// Ensure the container exists before rendering
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Failed to find the root element '#root'. Frontend cannot be mounted.");
}
