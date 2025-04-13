import { useState, useEffect } from 'react';

// Define a generic type for the hook's return value
interface UseMockDataReturn<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

/**
 * Custom hook to simulate fetching mock data asynchronously.
 * @param mockDataSource The mock data array to fetch.
 * @param delay The simulated network delay in milliseconds.
 */
function useMockData<T>(mockDataSource: T[], delay: number = 500): UseMockDataReturn<T[]> {
    const [data, setData] = useState<T[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Simulate API call
        const fetchData = () => {
            setLoading(true);
            setError(null);
            setTimeout(() => {
                try {
                    // In a real scenario, you'd fetch from an API endpoint
                    setData(mockDataSource);
                    setLoading(false);
                } catch (err) {
                    setError(err instanceof Error ? err : new Error('Failed to fetch mock data'));
                    setLoading(false);
                }
            }, delay);
        };

        fetchData();

        // Cleanup function (optional, not strictly needed for setTimeout)
        // return () => { /* potential cleanup */ };
    }, [mockDataSource, delay]); // Re-run effect if data source or delay changes

    return { data, loading, error };
}

export default useMockData;
