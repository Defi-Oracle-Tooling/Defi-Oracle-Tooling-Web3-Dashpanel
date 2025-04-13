import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from '../styles/user.module.css';
import StrategyBuilder from "../components/user/StrategyBuilder"; // Import placeholder
import TransactionMonitor from "../components/user/TransactionMonitor"; // Import placeholder
import RecommendationsPanel from "../components/user/RecommendationsPanel"; // Import placeholder


const UserPage: React.FC = () => (
  <div className={styles.pageContainer}>
    <Header />
    <main className={styles.mainContent}>
      <h1 className={styles.title}>User Dashboard</h1>
      {/* Removed the introductory paragraph */}

      {/* Render placeholder components */}
      <StrategyBuilder />
      <TransactionMonitor />
      <RecommendationsPanel />

    </main>
    <Footer />
  </div>
);

export default UserPage;
