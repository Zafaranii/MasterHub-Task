import { useState } from 'react';
import { createQuizTeacher } from '../services/quizService';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';

function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [duration, setDuration] = useState(10); // default duration
  const [grade, setGrade] = useState(1); // default grade
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('MCQ');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [trueFalseAnswer, setTrueFalseAnswer] = useState(null);
  const [shortAnswer, setShortAnswer] = useState('');
  const [points, setPoints] = useState(1);
  const [error, setError] = useState(null);
  const [addQuestionError, setAddQuestionError] = useState('');
  const navigate = useNavigate();

  const resetQuestionFields = () => {
    setQuestionText('');
    setQuestionType('MCQ');
    setOptions(['', '']);
    setCorrectAnswer('');
    setTrueFalseAnswer(null);
    setShortAnswer('');
    setPoints(1);
    setAddQuestionError('');
  };

  const addQuestion = () => {
    setAddQuestionError('');
    if (!questionText) {
      setAddQuestionError('Question text is required.');
      return;
    }
    if (questionType === 'MCQ') {
      const filteredOptions = options.filter(opt => opt.trim() !== '');
      if (filteredOptions.length < 2) {
        setAddQuestionError('At least two options are required for MCQ.');
        return;
      }
      if (!correctAnswer || !filteredOptions.includes(correctAnswer)) {
        setAddQuestionError('Correct answer must match one of the options.');
        return;
      }
    }
    if (questionType === 'TRUE_FALSE') {
      if (trueFalseAnswer === null) {
        setAddQuestionError('Please select True or False as the answer.');
        return;
      }
    }
    if (questionType === 'SHORT_ANSWER') {
      if (!shortAnswer.trim()) {
        setAddQuestionError('Short answer cannot be empty.');
        return;
      }
    }
    let questionObj = {
      question: questionText,
      type: questionType,
      points: points,
      correct_answer: correctAnswer,
      // quiz_id will be added by backend or after quiz creation
    };
    if (questionType === 'MCQ') {
      questionObj.options = options.filter(opt => opt.trim() !== '');
    } else if (questionType === 'TRUE_FALSE') {
      questionObj.true_false_answer = trueFalseAnswer;
    } else if (questionType === 'SHORT_ANSWER') {
      questionObj.short_answer = shortAnswer;
    }
    setQuestions([...questions, questionObj]);
    resetQuestionFields();
  };

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (idx) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await createQuizTeacher({ title, start, end, duration, grade, questions });
      navigate('/dashboard');
    } catch {
      setError('Failed to create quiz');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Create Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 12 }}
        />
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="duration" style={{ display: 'block', marginBottom: 4 }}>Duration (minutes)</label>
          <input
            id="duration"
            type="number"
            placeholder="Enter duration in minutes"
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            required
            min={1}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="grade" style={{ display: 'block', marginBottom: 4 }}>Grade</label>
          <input
            id="grade"
            type="number"
            placeholder="Enter grade (e.g., 1, 2, 3)"
            value={grade}
            onChange={e => setGrade(Number(e.target.value))}
            required
            min={1}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="start" style={{ display: 'block', marginBottom: 4 }}>Start Time (Optional)</label>
          <input
            id="start"
            type="datetime-local"
            value={start}
            onChange={e => setStart(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="end" style={{ display: 'block', marginBottom: 4 }}>End Time (Optional)</label>
          <input
            id="end"
            type="datetime-local"
            value={end}
            onChange={e => setEnd(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12, border: '1px solid #eee', padding: 12 }}>
          <input
            type="text"
            placeholder="Question text"
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            style={{ width: '70%', marginRight: 8 }}
          />
          <select value={questionType} onChange={e => setQuestionType(e.target.value)}>
            <option value="MCQ">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="SHORT_ANSWER">Short Answer</option>
          </select>
          <input
            type="number"
            min={1}
            value={points}
            onChange={e => setPoints(Number(e.target.value))}
            style={{ width: 60, marginLeft: 8 }}
            placeholder="Points"
          />
          {questionType === 'MCQ' && (
            <div style={{ marginTop: 8 }}>
              <div>Options:</div>
              {options.map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <input
                    type="text"
                    value={opt}
                    onChange={e => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    style={{ marginRight: 8 }}
                  />
                  <button type="button" onClick={() => removeOption(idx)} disabled={options.length <= 2}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addOption} style={{ marginTop: 4 }}>
                Add Option
              </button>
              <div style={{ marginTop: 8 }}>
                <input
                  type="text"
                  placeholder="Correct Answer"
                  value={correctAnswer}
                  onChange={e => setCorrectAnswer(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}
          {questionType === 'TRUE_FALSE' && (
            <div style={{ marginTop: 8 }}>
              <div>
                <label>
                  <input
                    type="radio"
                    name="trueFalseAnswer"
                    value="true"
                    checked={trueFalseAnswer === true}
                    onChange={() => { setTrueFalseAnswer(true); setCorrectAnswer('true'); }}
                  />
                  True
                </label>
                <label style={{ marginLeft: 16 }}>
                  <input
                    type="radio"
                    name="trueFalseAnswer"
                    value="false"
                    checked={trueFalseAnswer === false}
                    onChange={() => { setTrueFalseAnswer(false); setCorrectAnswer('false'); }}
                  />
                  False
                </label>
              </div>
            </div>
          )}
          {questionType === 'SHORT_ANSWER' && (
            <div style={{ marginTop: 8 }}>
              <input
                type="text"
                placeholder="Short Answer"
                value={shortAnswer}
                onChange={e => { setShortAnswer(e.target.value); setCorrectAnswer(e.target.value); }}
                style={{ width: '100%' }}
              />
            </div>
          )}
          <button type="button" onClick={addQuestion} style={{ marginLeft: 8, marginTop: 8 }}>
            Add Question
          </button>
          {addQuestionError && <div style={{ color: 'red', marginTop: 8 }}>{addQuestionError}</div>}
        </div>
        <ul>
          {questions.map((q, i) => (
            <li key={i}>
              {q.question} ({q.type})
              <button type="button" onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))} style={{ marginLeft: 8 }}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button type="submit" style={{ width: '100%' }}>
          Create Quiz
        </button>
        {error && <ErrorMessage message={error} />}
      </form>
    </div>
  );
}

export default CreateQuiz; 