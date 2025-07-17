import { createContext, useContext, useEffect, useState } from 'react';
import { login, signup, getCurrentUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    getCurrentUser(token)
      .then(user => {
        setUser(user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (credentials) => {
    const res = await login(credentials);
    if (res.access_token) {
      localStorage.setItem('access_token', res.access_token);
    }
    const u = await getCurrentUser(res.access_token);
    setUser(u);
  };

  const handleSignup = async (data) => {
    await signup(data);
    setUser(null);
  };

  const handleLogout = async () => {
    localStorage.removeItem('access_token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, signup: handleSignup, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 