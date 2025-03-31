import axios from 'axios';
import { message } from 'antd';

const api = axios.create({
  baseURL: 'http://localhost:3000/auth',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export const register = async (userData) => {
  try {
    const { data } = await api.post('/register', {
      email: userData.email,
      password: userData.password,
      mobile_number: userData.mobile_number,
      role: userData.role
    });
    message.success('Registration successful! Please login.');
    return data;
  } catch (error) {
    handleAuthError(error, 'Registration failed');
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const { data } = await api.post('/login', credentials);
    message.success('Login successful!');
    return data;
  } catch (error) {
    handleAuthError(error, 'Login failed');
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  message.success('Logged out successfully');
};

function handleAuthError(error, defaultMessage) {
  let errorMessage = defaultMessage;
  
  if (error.response) {
    errorMessage = error.response.data?.message || 
                  error.response.statusText || 
                  `Server error (${error.response.status})`;
    
    if (error.response.status === 401) {
      errorMessage = 'Invalid email or password';
    }
  } else if (error.request) {
    errorMessage = 'No response from server. Check your network connection.';
  }
  
  message.error(errorMessage);
  console.error('Auth error:', error);
}



