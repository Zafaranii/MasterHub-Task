import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStudentQuiz, submitStudentQuiz } from '../services/quizService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

function QuizStudentDetails() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetchStudentQuiz(id)
      .then(setQuiz)
      .catch(() => setError('Failed to load quiz'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitStudentQuiz(id, answers);
      setScore(res.score);
    } catch {
      setError('Failed to submit answers');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!quiz) return null;
  if (score !== null) return <div style={{ textAlign: 'center', margin: '2rem' }}>Your score: {score}</div>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>{quiz.title}</h2>
      <form onSubmit={handleSubmit}>
        {quiz.questions && quiz.questions.length > 0 ? (
          quiz.questions.map(q => (
            <div key={q.id} style={{ marginBottom: 16 }}>
              <div>{q.text}</div>
              {q.type === 'mcq' ? (
                q.options.map(opt => (
                  <label key={opt} style={{ marginRight: 12 }}>
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={e => handleChange(q.id, e.target.value)}
                    />
                    {opt}
                  </label>
                ))
              ) : (
                <input
                  type="text"
                  value={answers[q.id] || ''}
                  onChange={e => handleChange(q.id, e.target.value)}
                  style={{ width: '100%' }}
                />
              )}
            </div>
          ))
        ) : (
          <div>No questions found.</div>
        )}
        <button type="submit" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Submitting...' : 'Submit Answers'}
        </button>
      </form>
    </div>
  );
}

export default QuizStudentDetails; 