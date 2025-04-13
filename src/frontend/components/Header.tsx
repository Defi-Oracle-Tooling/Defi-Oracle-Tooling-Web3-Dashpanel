import React from 'react';
import { Link } from 'react-router-dom'; // Added import
import '../styles/common.css';

const Header = () => (
  <header>
    <h1>DeFi Oracle Dashboard</h1>
    <nav>
      <Link to="/admin">Admin</Link> | <Link to="/user">User</Link>
    </nav>
  </header>
);

export default Header;
