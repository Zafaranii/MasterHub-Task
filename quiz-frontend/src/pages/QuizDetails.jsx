import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchQuizById } from '../services/quizService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import api from '../services/api';

function QuizDetails() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [expired, setExpired] = useState(false);
  const [score, setScore] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const timerRef = useRef();

  useEffect(() => {
    fetchQuizById(id)
      .then(setQuiz)
      .catch((err) => {
        if (err?.response?.data?.detail === 'You have already submitted this quiz') {
          setAlreadySubmitted(true);
          setError('You have already submitted this quiz');
        } else if (err?.response?.data?.detail === 'Quiz has ended') {
          setAvailabilityStatus('ended');
          setError('This quiz has ended and is no longer available.');
        } else if (err?.response?.data?.detail === 'Quiz has not started yet') {
          setAvailabilityStatus('not_started');
          setError('This quiz has not started yet.');
        } else {
          setError('Failed to load quiz');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (quiz) {
      const now = new Date();
      if (quiz.start_time) {
        const startTime = new Date(quiz.start_time);
        if (now < startTime) {
          setAvailabilityStatus('not_started');
          return;
        }
      }
      if (quiz.end_time) {
        const endTime = new Date(quiz.end_time);
        if (now > endTime) {
          setAvailabilityStatus('ended');
          return;
        }
      }

      const duration = quiz.duration ? quiz.duration * 60 : 600;
      setTimeLeft(duration);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 1) {
            clearInterval(timerRef.current);
            setExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [quiz]);

  const handleChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const answersArray = quiz.questions.map(q => ({
        question_id: q.id,
        answer_text: answers[q.id] || ''
      }));
      const res = await api.post('/submissions/create-submission', {
        quiz_id: Number(id),
        answers: answersArray
      });
      
      const responseData = res.data;
      setScore(responseData.score);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit answers');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  if (loading) return <Loader />;
  if (error) {
    if (alreadySubmitted) {
      return (
        <div style={{ textAlign: 'center', margin: '2rem auto', maxWidth: 600 }}>
          <h2>Quiz Already Submitted</h2>
          <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>
          <button onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </button>
        </div>
      );
    }
    if (error === 'This quiz has not started yet.' || error === 'Quiz has not started yet') {
      return (
        <div style={{ textAlign: 'center', margin: '2rem auto', maxWidth: 600 }}>
          <h2>Quiz Not Available Yet</h2>
          <p style={{ color: 'orange', marginBottom: 16 }}>This quiz has not started yet. Please check back later.</p>
          <button onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </button>
        </div>
      );
    }
    if (error === 'This quiz has ended and is no longer available.' || error === 'Quiz has ended') {
      return (
        <div style={{ textAlign: 'center', margin: '2rem auto', maxWidth: 600 }}>
          <h2>Quiz Has Ended</h2>
          <p style={{ color: 'red', marginBottom: 16 }}>This quiz has ended and is no longer available.</p>
          <button onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </button>
        </div>
      );
    }
    if (availabilityStatus === 'ended') {
      return (
        <div style={{ textAlign: 'center', margin: '2rem auto', maxWidth: 600 }}>
          <h2>Quiz Has Ended</h2>
          <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>
          {quiz?.end_time && (
            <p style={{ marginBottom: 16 }}>
              <strong>End Time:</strong> {formatDateTime(quiz.end_time)}
            </p>
          )}
          <button onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </button>
        </div>
      );
    }
    if (availabilityStatus === 'not_started') {
      return (
        <div style={{ textAlign: 'center', margin: '2rem auto', maxWidth: 600 }}>
          <h2>Quiz Not Available Yet</h2>
          <p style={{ color: 'orange', marginBottom: 16 }}>{error}</p>
          {quiz?.start_time && (
            <p style={{ marginBottom: 16 }}>
              <strong>Start Time:</strong> {formatDateTime(quiz.start_time)}
            </p>
          )}
          <button onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </button>
        </div>
      );
    }
    return <ErrorMessage message={error} />;
  }
  if (!quiz) return null;

  if (submitted) return (
    <div style={{ textAlign: 'center', margin: '2rem' }}>
      <h2>Quiz Submitted Successfully!</h2>
      <p>Thank you for completing the quiz.</p>
      {score !== null && score !== undefined ? (
        <div style={{ marginTop: 16, fontSize: '1.2em', fontWeight: 'bold' }}>
          Your score: {score}
        </div>
      ) : (
        <div style={{ marginTop: 16, color: '#666' }}>
          Your score will be available soon.
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
  if (expired) return <div style={{ textAlign: 'center', margin: '2rem' }}>Time is up! Quiz closed.</div>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>{quiz.title}</h2>
      
      {(quiz.start_time || quiz.end_time) && (
        <div style={{ 
          marginBottom: 16, 
          padding: 12, 
          backgroundColor: '#f0f8ff', 
          border: '1px solid #ccc',
          borderRadius: 4
        }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Quiz Availability</h4>
          {quiz.start_time && (
            <div style={{ marginBottom: 4 }}>
              <strong>Start Time:</strong> {formatDateTime(quiz.start_time)}
            </div>
          )}
          {quiz.end_time && (
            <div style={{ marginBottom: 4 }}>
              <strong>End Time:</strong> {formatDateTime(quiz.end_time)}
            </div>
          )}
        </div>
      )}

      {timeLeft !== null && <div style={{ marginBottom: 16 }}>Time left: {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</div>}
      
      <form onSubmit={handleSubmit}>
        {quiz.questions && quiz.questions.length > 0 ? (
          quiz.questions.map(q => (
            <div key={q.id} style={{ marginBottom: 16 }}>
              <div><strong>Question:</strong> {q.question}</div>
              <div><strong>Type:</strong> {q.type}</div>
              {q.type === 'MCQ' && q.options && (
                <div>
                  <strong>Options:</strong>
                  <div>
                    {q.options.map((opt, idx) => (
                      <label key={idx} style={{ marginRight: 12 }}>
                        <input
                          type="radio"
                          name={`q_${q.id}`}
                          value={opt}
                          checked={answers[q.id] === opt}
                          onChange={e => handleChange(q.id, e.target.value)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {q.type === 'SHORT_ANSWER' && (
                <input
                  type="text"
                  value={answers[q.id] || ''}
                  onChange={e => handleChange(q.id, e.target.value)}
                  style={{ width: '100%' }}
                  placeholder="Your answer"
                />
              )}
              {q.type === 'TRUE_FALSE' && (
                <div>
                  <label style={{ marginRight: 12 }}>
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      value="true"
                      checked={answers[q.id] === 'true'}
                      onChange={e => handleChange(q.id, 'true')}
                    />
                    True
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      value="false"
                      checked={answers[q.id] === 'false'}
                      onChange={e => handleChange(q.id, 'false')}
                    />
                    False
                  </label>
                </div>
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

export default QuizDetails; 