import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
    
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const login = async (data) => {
  try {
    const response = await api.post('/auth/login', data);
    if (response.data.success) {
     
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Login failed' };
  }
};

export const signup = async (data) => {
  try {
    const response = await api.post('/auth/signup', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Signup failed' };
  }
};

// Student API calls
export const getStudents = async () => {
  try {
    const response = await api.get('/students');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch students' };
  }
};

export const getStudent = async (id) => {
  try {
    const response = await api.get(`/students/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch student' };
  }
};

export const addStudent = async (data) => {
  try {
    const response = await api.post('/students', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to add student' };
  }
};

export const editStudent = async (id, data) => {
  try {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to update student' };
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to delete student' };
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/students/user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to delete user' };
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/students/user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to get user' };
  }
};

export const editUser = async (id, data) => {
  try {
    const response = await api.put(`/students/user/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to update user' };
  }
};


export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export default api;
