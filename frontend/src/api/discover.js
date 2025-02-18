export async function fetchDiscoverUsers(getAccessTokenSilently) {
  const token = await getAccessTokenSilently();
  const response = await fetch('http://localhost:5001/api/discover', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching discover users');
  }

  return response.json();
}
