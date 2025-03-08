// frontend/src/api/chatSummary.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export async function streamChatSummary(getAccessTokenSilently, senderId, receiverId, onChunk) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  const token = await getAccessTokenSilently();
  const response = await fetch(`${API_URL}/api/chats/summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Optionally add Authorization header if needed:
      // 'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ senderId, receiverId }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stream");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let fullResult = "";

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunk = decoder.decode(value);
    fullResult += chunk;
    if (onChunk) onChunk(chunk);
  }

  return fullResult; // Final summary text if needed.
}

