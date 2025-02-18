export async function submitSwipe(getAccessTokenSilently, swipeData) {
  const token = await getAccessTokenSilently();
  const response = await fetch('http://localhost:5001/api/swipes', {
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
