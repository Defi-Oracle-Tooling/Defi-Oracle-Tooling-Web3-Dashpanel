import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/common.css';
import '../styles/user.css';


const UserPage: React.FC = () => (
  <div>
    <Header />
    <main>
      <h1>User Dashboard</h1>
      <p>Build strategies, monitor transactions, and view recommendations.</p>
      {/* Implement drag-and-drop strategy builder and real-time charts here */}
    </main>
    <Footer />
  </div>
);

export default UserPage;
