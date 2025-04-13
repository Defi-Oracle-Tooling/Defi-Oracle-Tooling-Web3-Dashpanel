import React, { useState, useEffect } from 'react';
import { getVirtualAccountBalance, VirtualAccountBalance } from '../../services/api'; // Import API function and type
// import styles from '../../styles/user.module.css'; // Optional: Add specific styles later

const TransactionMonitor: React.FC = () => {
    // State for balance data, loading status, and errors
    const [balance, setBalance] = useState<VirtualAccountBalance | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBalance = async () => {
            setLoading(true);
            setError(null);
            try {
                // Using a hardcoded userId for now - replace with actual user context later
                const userId = 'test-user';
                const data = await getVirtualAccountBalance(userId);
                setBalance(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <section /* className={styles.monitorSection} */ style={{ marginBottom: '20px' }}>
            <h2>Account Balance & Transactions</h2> {/* Updated title */}

            {/* Display Balance */}
            <div style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '4px' }}>
                <h3>Virtual Account Balance</h3>
                {loading && <p>Loading balance...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                {balance && (
                    <div>
                        <p><strong>Account ID:</strong> {balance.accountId}</p>
                        <p><strong>Available Balance:</strong> {balance.availableBalance} {balance.currency}</p>
                        <p><strong>Total Balance:</strong> {balance.accountBalance} {balance.currency}</p>
                        <p><strong>Status:</strong> {balance.active ? 'Active' : 'Inactive'} {balance.frozen ? '(Frozen)' : ''}</p>
                    </div>
                )}
            </div>

            {/* Placeholder for Transaction History */}
            <h3>Transaction History</h3>
            <p>Real-time transaction monitoring and history will go here.</p>
            <div style={{ border: '1px dashed grey', padding: '20px', minHeight: '100px', marginTop: '10px' }}>
                Transaction List / Chart Area
            </div>
        </section>
    );
};

export default TransactionMonitor;
