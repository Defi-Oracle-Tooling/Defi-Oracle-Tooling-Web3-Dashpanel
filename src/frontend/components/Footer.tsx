import React from "react";
import styles from '../styles/common.module.css'; // Changed import to CSS Module

const Footer: React.FC = () => (
  <footer className={styles.footer}> {/* Applied .footer class */}
    <p>&copy; 2025 DeFi Oracle Tooling Dashboard. All rights reserved.</p>
  </footer>
);

export default Footer;
