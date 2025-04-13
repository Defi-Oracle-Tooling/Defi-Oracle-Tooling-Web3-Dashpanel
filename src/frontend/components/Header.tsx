import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/common.css'; // Keep common styles import

const Header: React.FC = () => ( // Ensure component name matches convention
  <header>
    <h1>DeFi Oracle Dashboard</h1>
    <nav>
      {/* Use Link component for SPA navigation */}
      <Link to="/admin">Admin Panel</Link> | <Link to="/user">User Panel</Link>
    </nav>
  </header>
);

export default Header;
