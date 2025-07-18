import { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import ErrorMessage from '../components/ErrorMessage';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  const [grade, setGrade] = useState(1);
  const [error, setError] = useState(null);
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const signupData = { 
        username, 
        password, 
        email, 
        full_name: fullName, 
        is_teacher: isTeacher 
      };
      
      // Only add grade if user is not a teacher
      if (!isTeacher) {
        signupData.grade = grade;
      }
      
      await signup(signupData);
      navigate('/dashboard');
    } catch {
      setError('Signup failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Sign Up</h2>
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
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 12 }}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
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
        <div style={{ marginBottom: 12 }}>
          <label>
            <input
              type="checkbox"
              checked={isTeacher}
              onChange={e => setIsTeacher(e.target.checked)}
            />
            {' '}Sign up as Teacher
          </label>
        </div>
        {!isTeacher && (
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="grade" style={{ display: 'block', marginBottom: 4 }}>Grade</label>
            <select
              id="grade"
              value={grade}
              onChange={e => setGrade(Number(e.target.value))}
              required={!isTeacher}
              style={{ width: '100%', padding: 8 }}
            >
              <option value={1}>Grade 1</option>
              <option value={2}>Grade 2</option>
              <option value={3}>Grade 3</option>
              <option value={4}>Grade 4</option>
              <option value={5}>Grade 5</option>
              <option value={6}>Grade 6</option>
              <option value={7}>Grade 7</option>
              <option value={8}>Grade 8</option>
              <option value={9}>Grade 9</option>
              <option value={10}>Grade 10</option>
              <option value={11}>Grade 11</option>
              <option value={12}>Grade 12</option>
            </select>
          </div>
        )}
        <button type="submit" style={{ width: '100%' }}>
          Sign Up
        </button>
        {error && <ErrorMessage message={error} />}
      </form>
      <div style={{ marginTop: 16 }}>
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
}

export default Signup; 