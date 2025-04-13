import React from 'react';
import styles from '../../styles/admin.module.css'; // Adjusted path
import useMockData from '../../hooks/useMockData'; // Adjusted path
import { mockAdminIntegrations, Integration } from '../../mockData'; // Adjusted path
import { formatDate } from '../../utils/utilities'; // Adjusted path

interface IntegrationListProps {
    // Add any props if needed in the future
}

const IntegrationList: React.FC<IntegrationListProps> = () => {
    // Use the hook to fetch mock data
    const { data: integrations, loading, error } = useMockData<Integration>(mockAdminIntegrations, 750);

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
            {error && <p className={styles.errorText}>Error loading integrations: {error.message}</p>}
            {integrations && (
                <ul className={styles.integrationList}>
                    {integrations.map((integration) => (
                        <li key={integration.id} className={styles.integrationItem}>
                            <strong>{integration.name}</strong> ({integration.type})
                            <br />
                            Status: <span className={getStatusClass(integration.status)}>{integration.status}</span>
                            <br />
                            Last Sync: {formatDate(integration.lastSync)}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default IntegrationList;
