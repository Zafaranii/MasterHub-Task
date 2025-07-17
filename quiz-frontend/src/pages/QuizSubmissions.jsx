import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuizSubmissions } from '../services/quizService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

function QuizSubmissions() {
  const { id } = useParams();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizSubmissions(id)
      .then(setSubs)
      .catch((err) => {
        if (err?.response?.data?.detail === 'No submissions found for this quiz') {
          setSubs([]); // Treat as empty submissions
          setError(null);
        } else {
          setError('Failed to load submissions');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: 16 }}>
        Go Back to Dashboard
      </button>
      <h2>Quiz Submissions</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'center' }}>Student</th>
            <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'center' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {subs.length === 0 ? (
            <tr>
              <td colSpan={2} style={{ textAlign: 'center', padding: 16 }}>
                No submissions found for this quiz.
              </td>
            </tr>
          ) : (
            subs.map((s, i) => (
              <tr key={i}>
                <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'center' }}>{s.student_id}</td>
                <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'center' }}>{s.score}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default QuizSubmissions; 