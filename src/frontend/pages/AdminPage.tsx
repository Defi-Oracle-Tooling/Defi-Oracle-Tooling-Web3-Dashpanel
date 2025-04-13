import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/admin.module.css';
import IntegrationList from '../components/admin/IntegrationList'; // Import the new component

const AdminPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p>Manage integrations, monitor logs, and perform administrative actions.</p>

        {/* Render the IntegrationList component */}
        <IntegrationList />

        {/* Add other admin sections/components here */}
        {/* e.g., <LogViewer /> */}
        {/* e.g., <AdminSettings /> */}

      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
