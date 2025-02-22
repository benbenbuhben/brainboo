const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export async function getChats(getAccessTokenSilently, senderId, receiverId, limit = 10, skip = 0) {
    try {
        const token = await getAccessTokenSilently();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(`${API_URL}/api/chats/${senderId}/${receiverId}?limit=${limit}&skip=${skip}`, {
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

export async function addChat(getAccessTokenSilently, senderId, receiverId, message) {
    try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${API_URL}/api/chats`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ senderId, receiverId, content: message }),
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            const error = new Error(errorBody?.error || 'Error adding chat');
            error.status = response.status;
            throw error;
        }
        return response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}