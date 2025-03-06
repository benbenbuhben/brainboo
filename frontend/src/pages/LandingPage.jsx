import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',  textAlign: 'center' }}>
      <h1>Welcome to BrainBoo!</h1>
      <p>Find your perfect study buddy and boost your learning experience! BrainBoo connects you with peers who share your interests and major, making collaboration seamless and fun.</p>
      <img src="/landing.jpg" alt="BrainBoo Landing" style={{ maxWidth: '50%', height: 'auto' }} />
      <br />
      <Link to="/login" style={{ padding: '10px 20px',  backgroundColor: '#fcbe31', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Get Started</Link>
    </div>
  );
}
