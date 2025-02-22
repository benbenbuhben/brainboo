const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export async function getMatches(getAccessTokenSilently) {
    try {
        const token = await getAccessTokenSilently();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${API_URL}/api/matches`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            const error = new Error(errorBody?.error || 'Error fetching matches');
            error.status = response.status;
            throw error;
        }
        const resData = await response.json();
        return resData;
    } catch (error) {
        console.error(error);
        throw error;
    }
}