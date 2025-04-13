import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/common.css'; // Keep common styles
import '../styles/admin.css'; // Keep admin-specific styles

const AdminPage: React.FC = () => ( // Changed component name to match file name and convention
  <div>
    <Header />
    <main>
      <h1>Admin Dashboard</h1>
      <p>Manage integrations, monitor logs, and perform administrative actions.</p>
      {/* Add additional admin panel components here */}
      {/* Removed the previous ul list */}
    </main>
    <Footer />
  </div>
);

// Removed the ReactDOM rendering logic, as it's handled in main.tsx

export default AdminPage; // Export AdminPage
