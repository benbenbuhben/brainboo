import { useAuth0 } from '@auth0/auth0-react';

export default function LoginPage() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  console.log('redirect url:',  window.location.origin);
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Login Page</h1>
      {isAuthenticated ? (
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log Out
        </button>
      ) : (
        <button onClick={() => loginWithRedirect({ redirect_uri: window.location.origin })}>
          Log In
        </button>
      )}
    </div>
  );
}
