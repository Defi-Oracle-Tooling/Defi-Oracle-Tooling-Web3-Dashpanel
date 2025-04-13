import React from "react";
import { createRoot } from "react-dom/client";

const AdminDashboard = () => (
  <div>
    <h1>Admin Dashboard</h1>
    <p>Manage integrations, view logs, and perform administrative actions.</p>
    <ul>
      <li>Integration Management</li>
      <li>System Logs</li>
      <li>Admin Settings</li>
    </ul>
  </div>
);

const container = document.getElementById("admin-root");
if (container) {
  const root = createRoot(container);
  root.render(<AdminDashboard />);
} else {
  console.error("Failed to find the root element 'admin-root'");
}

export default AdminDashboard;
