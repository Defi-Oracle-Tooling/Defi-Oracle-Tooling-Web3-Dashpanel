import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin.module.css';
import { getIntegrations, Integration } from '../../services/api'; // Import the API function and type
import { formatDate } from '../../utils/utilities';

interface IntegrationListProps {
    // Add any props if needed in the future
}

const IntegrationList: React.FC<IntegrationListProps> = () => {
    // State for real integration data
    const [integrations, setIntegrations] = useState<Integration[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIntegrations = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getIntegrations();
                setIntegrations(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchIntegrations();
    }, []); // Runs once on mount

    // Helper function to get status class
    const getStatusClass = (status: Integration['status']) => {
        switch (status) {
            case 'Active': return styles.statusActive;
            case 'Inactive': return styles.statusInactive;
            case 'Error': return styles.statusError;
            default: return '';
        }
    };

    return (
        <section className={styles.integrationSection}>
            <h2>Integrations</h2>
            {loading && <p>Loading integrations...</p>}
            {error && <p className={styles.errorText}>Error loading integrations: {error}</p>}
            {integrations && (
                <ul className={styles.integrationList}>
                    {integrations.map((integration) => (
                        <li key={integration.id} className={styles.integrationItem}>
                            <strong>{integration.name}</strong> ({integration.type})
                            <br />
                            Status: <span className={getStatusClass(integration.status)}>{integration.status}</span>
                            <br />
                            {/* Parse date string before formatting */}
                            Last Sync: {formatDate(new Date(integration.lastSync))}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default IntegrationList;
