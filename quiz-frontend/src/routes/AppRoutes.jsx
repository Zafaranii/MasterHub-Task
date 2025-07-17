import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import QuizDetails from '../pages/QuizDetails';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import CreateQuiz from '../pages/CreateQuiz';
import QuizResults from '../pages/QuizResults';
import QuizSubmissions from '../pages/QuizSubmissions';
import QuizStudentDetails from '../pages/QuizStudentDetails';
import { useAuth } from '../components/AuthProvider';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function AppRoutes({ onlyAuth }) {
  if (!onlyAuth) {
    // Only show login/signup routes
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/quizzes/:id" element={<QuizDetails />} />
      <Route path="/quizzes/:id/results" element={<QuizResults />} />
      <Route path="/quizzes/:id/submissions" element={<ProtectedRoute><QuizSubmissions /></ProtectedRoute>} />
      <Route path="/quizzes/create" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
    </Routes>
  );
}

export default AppRoutes;