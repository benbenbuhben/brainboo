const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export async function getChats(getAccessTokenSilently, senderId, receiverId) {
    try {
        const token = await getAccessTokenSilently();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(`${API_URL}/api/chats/${senderId}/${receiverId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            const error = new Error(errorBody?.error || 'Error fetching chats');
            error.status = response.status;
            throw error;
        }
        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}