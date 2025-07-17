import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { fetchTeacherQuizzes, fetchStudentQuizzes } from '../services/quizService';

function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.is_teacher == 1) {
      fetchTeacherQuizzes()
        .then(data => {
          setQuizzes(data);
        })
        .catch(err => {
          if (err?.response?.data?.detail === 'No quizzes found for this teacher') {
            setQuizzes([]);
            setError(null);
          } else {
            setError('Failed to load quizzes');
          }
        })
        .finally(() => setLoading(false));
    } else if (user && user.is_teacher == 0) {
      fetchStudentQuizzes()
        .then(data => {
          setQuizzes(data);
        })
        .catch(() => {
          setError('Failed to load quizzes');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <div style={{ maxWidth: 600, margin: '2rem auto' }}>Not authorized.</div>;

  if (user.is_teacher == 1 || user.is_teacher === true || user.is_teacher === '1') {
    return (
      <div style={{ maxWidth: 600, margin: '2rem auto' }}>
        <h2>Your Quizzes</h2>
        <button onClick={() => navigate('/quizzes/create')} style={{ marginBottom: 16 }}>
          Create New Quiz
        </button>
        {error ? (
          <p>{error}</p>
        ) : quizzes.length === 0 ? (
          <p>No quizzes created yet.</p>
        ) : (
          <ul>
            {quizzes.map(q => (
              <li key={q.id}>
                {q.title} <a href={`/quizzes/${q.id}/submissions`}>View Submissions</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Available Quizzes</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        <ul>
          {quizzes.map(q => (
            <li key={q.id}>
              <Link to={`/quizzes/${q.id}`}>{q.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard; 