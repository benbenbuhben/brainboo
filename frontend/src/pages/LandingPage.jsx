import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      <h1>Welcome to BrainBoo!</h1>
      <p>Your peer learning platform.</p>
      <img src="/landing.jpg" alt="BrainBoo Landing" style={{ maxWidth: '25%', height: 'auto' }} />
      <br />
      <Link to="/login">Get Started</Link>
    </div>
  );
}
