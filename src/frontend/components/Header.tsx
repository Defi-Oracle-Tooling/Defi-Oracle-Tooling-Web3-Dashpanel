import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/common.module.css'; // Changed import to CSS Module

const Header: React.FC = () => (
  <header className={styles.header}> {/* Applied .header class */}
    <h1>DeFi Oracle Dashboard</h1>
    <nav className={styles.nav}> {/* Applied .nav class */}
      {/* Use Link component for SPA navigation */}
      <Link to="/admin">Admin Panel</Link> | <Link to="/user">User Panel</Link>
    </nav>
  </header>
);

export default Header;
