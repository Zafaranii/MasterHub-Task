import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

function QuizResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedResults = localStorage.getItem(`quiz_results_${id}`);
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
      } catch (err) {
        setError('Failed to load results');
      }
    } else {
      setError('No results found for this quiz');
    }
    setLoading(false);
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!results) return null;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: 16 }}>
        Go Back to Dashboard
      </button>
      <h2>Quiz Results</h2>
      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: 16 }}>
        Score: {results.score}
      </div>
      <div>
        <h3>Question Details:</h3>
        {results.questions && results.questions.map((question, index) => (
          <div key={index} style={{ marginBottom: 16, padding: 12, border: '1px solid #ccc', borderRadius: 4 }}>
            <div><strong>Question {index + 1}:</strong> {question.question}</div>
            <div><strong>Your Answer:</strong> {results.answers[question.id] || 'No answer provided'}</div>
            <div><strong>Correct Answer:</strong> {question.correct_answer}</div>
            <div><strong>Points:</strong> {question.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizResults;