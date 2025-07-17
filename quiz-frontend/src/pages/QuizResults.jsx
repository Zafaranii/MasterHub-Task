import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizResults } from '../services/quizService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

function QuizResults() {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getQuizResults(id)
      .then(setResults)
      .catch(() => setError('Failed to load results'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!results) return null;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Quiz Results</h2>
      <div>Score: {results.score}</div>
      <ul>
        {results.answers.map((a, i) => (
          <li key={i}>
            <div>Q: {a.question}</div>
            <div>Your answer: {a.answer}</div>
            <div>Correct: {a.correct ? 'Yes' : 'No'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizResults; 