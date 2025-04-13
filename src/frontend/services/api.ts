/**
 * Functions for interacting with the backend API.
 */

// Define the expected structure of the balance response based on backend/app/models/schemas.py (VAResponse)
// Assuming VAResponse includes at least 'availableBalance' and 'currency'
export interface VirtualAccountBalance {
    accountId: string;
    availableBalance: string; // Tatum often uses strings for balances
    accountBalance: string;
    frozen: boolean;
    active: boolean;
    currency: string;
    // Add other fields from VAResponse as needed
}

// Define the Integration type based on expected API response
// (Moved from mockData.ts)
export interface Integration {
    id: string;
    name: string;
    type: 'Oracle' | 'DEX' | 'Lending' | 'Other'; // Assuming these are the possible types
    status: 'Active' | 'Inactive' | 'Error'; // Assuming these are the possible statuses
    lastSync: string; // Assuming API returns date as ISO string
    // Add other relevant fields from the backend API response
}

// Get the base URL for the backend API
// In development (using Vite proxy or direct), it might be relative or absolute
// In production, this should point to your deployed backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'; // Default to localhost:8000

/**
 * Fetches the virtual account balance for a given user ID.
 * @param userId The ID of the user whose balance to fetch.
 */
export async function getVirtualAccountBalance(userId: string): Promise<VirtualAccountBalance> {
    const url = `${API_BASE_URL}/api/va/balance/${userId}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            // Attempt to read error details from backend response
            let errorDetails = 'Unknown error';
            try {
                const errorData = await response.json();
                errorDetails = errorData.detail || JSON.stringify(errorData);
            } catch (jsonError) {
                // If reading JSON fails, use the status text
                errorDetails = response.statusText;
            }
            throw new Error(`Failed to fetch balance: ${response.status} ${errorDetails}`);
        }

        const data: VirtualAccountBalance = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching virtual account balance:", error);
        // Re-throw the error to be caught by the calling component
        throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
}

/**
 * Fetches the list of integrations from the backend.
 */
export async function getIntegrations(): Promise<Integration[]> {
    // Assuming the backend endpoint is /api/integrations
    const url = `${API_BASE_URL}/api/integrations`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            let errorDetails = 'Unknown error';
            try {
                const errorData = await response.json();
                errorDetails = errorData.detail || JSON.stringify(errorData);
            } catch (jsonError) {
                errorDetails = response.statusText;
            }
            throw new Error(`Failed to fetch integrations: ${response.status} ${errorDetails}`);
        }

        const data: Integration[] = await response.json();
        // Optional: Convert date strings to Date objects if needed immediately
        // return data.map(int => ({ ...int, lastSync: new Date(int.lastSync) }));
        return data;

    } catch (error) {
        console.error("Error fetching integrations:", error);
        throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
}

// Add other API functions here as needed (e.g., postStrategy)
