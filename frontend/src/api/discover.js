const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export async function fetchDiscoverUsers(getAccessTokenSilently) {
  const token = await getAccessTokenSilently();
  const response = await fetch(`${API_URL}/api/discover`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching discover users');
  }

  return response.json();
}
