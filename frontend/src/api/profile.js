const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';


export async function fetchProfile(getAccessTokenSilently) {
  const token = await getAccessTokenSilently(); // get the access token

  const response = await fetch(`${API_URL}/api/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const error = new Error('Error fetching profile');
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function createProfile(profileData) {
  const response = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  const responseBody = await response.text();
  if (!response.ok) {
    throw new Error('Error creating profile');
  }
  return JSON.parse(responseBody);
}

export async function fetchOrCreateProfile(getAccessTokenSilently, auth0User) {
  try {
    // Await the result so that any error can be caught by the catch block
    return await fetchProfile(getAccessTokenSilently);
  } catch (error) {
    console.error('[fetchOrCreateProfile] Error fetching profile:', error);
    if (error.status === 404) {
      try {
        return await createProfile({
          auth0Id: auth0User.sub,
          email: auth0User.email,
          name: auth0User.name,
          profilePicture: auth0User.picture,
        });
      } catch (creationError) {
        const lowerMessage = creationError.message.toLowerCase();
        if (lowerMessage.includes('duplicate') || lowerMessage.includes('already exists')) {
          return await fetchProfile(getAccessTokenSilently);
        }
        throw creationError;
      }
    }
    throw error;
  }
}

export async function updateProfile(getAccessTokenSilently, profileData) {
  const token = await getAccessTokenSilently();
  const response = await fetch(`${API_URL}/api/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    throw new Error('Error updating profile');
  }
  return response.json();
}

