import api from './api';

export const fetchUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

export const signup = async (userData) => {
  const res = await api.post('/users/signup', userData);
  return res.data;
};

export const login = async (credentials) => {
  // Send as form data for OAuth2PasswordRequestForm
  const params = new URLSearchParams();
  params.append('username', credentials.username);
  params.append('password', credentials.password);
  const res = await api.post('/users/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return res.data;
};

export const getCurrentUser = async (token) => {
  // Optionally accept a token for direct call after login
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await api.get('/users/me', { headers });
  return res.data;
}; 