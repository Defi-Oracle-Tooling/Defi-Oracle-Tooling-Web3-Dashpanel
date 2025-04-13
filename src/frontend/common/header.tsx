import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AdminDashboard from "../admin/admin";
import UserDashboard from "../user/user";

const Header = () => (
  <header>
    <h1>DeFi Oracle Dashboard</h1>
    <nav>
      <Link to="/admin">Admin</Link> | <Link to="/user">User</Link>
    </nav>
  </header>
);

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/user" element={<UserDashboard />} />
    </Routes>
  </Router>
);

export default App;
