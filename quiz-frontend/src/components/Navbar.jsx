import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';

function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 12 }}>Hello, {user.username}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar; 