import { useAuth } from '../components/AuthProvider';
import { Link } from 'react-router-dom';

function Home() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
      <h1>Quiz App</h1>
      <p>Welcome, {user.username}!</p>
      <div style={{ marginTop: 24 }}>
        <Link to="/dashboard">Dashboard</Link>
        {user.is_teacher == 1 && (
          <>
            {' | '}<Link to="/quizzes/create">Create Quiz</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Home; 