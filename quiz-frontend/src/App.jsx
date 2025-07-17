import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider, useAuth } from './components/AuthProvider';
import Navbar from './components/Navbar';

function AppContent() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <>
      {user && <Navbar />}
      <AppRoutes onlyAuth={!!user} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
