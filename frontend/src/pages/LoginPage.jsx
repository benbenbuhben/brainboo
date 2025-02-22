import { useAuth0 } from '@auth0/auth0-react';

export default function LoginPage() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Login Page</h1>
      {isAuthenticated ? (
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log Out
        </button>
      ) : (
        <button onClick={() => loginWithRedirect()}>
          Log In
        </button>
      )}
    </div>
  );
}
