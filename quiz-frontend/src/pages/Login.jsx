import { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import ErrorMessage from '../components/ErrorMessage';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ username, password });
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 12 }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 12 }}
          />
        </div>
        <button type="submit" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <ErrorMessage message={error} />}
      </form>
      <div style={{ marginTop: 16 }}>
        <Link to="/signup">Don't have an account? Sign up</Link>
      </div>
    </div>
  );
}

export default Login;
