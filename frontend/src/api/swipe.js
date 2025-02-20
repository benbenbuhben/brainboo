const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export async function submitSwipe(getAccessTokenSilently, swipeData) {
  const token = await getAccessTokenSilently();
  const response = await fetch(`${API_URL}/api/swipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(swipeData),
  });

  if (!response.ok) {
    throw new Error('Error submitting swipe');
  }
  return response.json();
}
