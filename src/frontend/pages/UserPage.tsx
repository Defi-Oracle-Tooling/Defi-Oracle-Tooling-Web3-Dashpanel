import React from "react";
import { createRoot } from "react-dom/client";

const UserDashboard = () => (
  <div>
    <h1>User Dashboard</h1>
    <p>Build strategies, monitor transactions, and view recommendations.</p>
    <ul>
      <li>Strategy Builder</li>
      <li>Transaction Monitoring</li>
      <li>AI Recommendations</li>
    </ul>
  </div>
);

const container = document.getElementById("user-root");
if (container) {
  const root = createRoot(container);
  root.render(<UserDashboard />);
} else {
  console.error("Failed to find the root element 'user-root'");
}

export default UserDashboard;
