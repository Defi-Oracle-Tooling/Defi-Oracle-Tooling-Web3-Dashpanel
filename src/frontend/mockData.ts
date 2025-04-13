/**
 * Mock data for development and testing.
 */

// Define an interface for the integration data structure
export interface Integration {
    id: string;
    name: string;
    type: 'Oracle' | 'DEX' | 'Lending' | 'Other';
    status: 'Active' | 'Inactive' | 'Error';
    lastSync: Date;
}

// Mock data for admin integrations
export const mockAdminIntegrations: Integration[] = [
    {
        id: 'int-001',
        name: 'Chainlink Price Feed (ETH/USD)',
        type: 'Oracle',
        status: 'Active',
        lastSync: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
        id: 'int-002',
        name: 'Uniswap V3 Router',
        type: 'DEX',
        status: 'Active',
        lastSync: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    },
    {
        id: 'int-003',
        name: 'Aave V2 Lending Pool',
        type: 'Lending',
        status: 'Inactive',
        lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
        id: 'int-004',
        name: 'Tatum Blockchain API',
        type: 'Other',
        status: 'Error',
        lastSync: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    },
];

// Add more mock data sets as needed (e.g., for user dashboard)
// export const mockUserTransactions = [...];
