import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data?.detail || error.message);
  }
);

// Auth API
export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const logout = () => {
  return api.post('/auth/logout');
};

export const signup = (userData) => {
  return api.post('/auth/register', userData);
};

// Profile API
export const getProfile = () => {
  return api.get('/candidates/profile');
};

export const updateProfile = (profileData) => {
  return api.put('/candidates/profile', profileData);
};

// Jobs API
export const getJobs = () => {
  return api.get('/jobs');
};
export const getJobById = async (id) => {
  return  api.get(`/jobs/${id}`);
  
};

export const getJob = (id) => {
  return api.get(`/jobs/${id}`);
};

export const createJob = (jobData) => {
  return api.post('/jobs', jobData);
};

export const updateJob = (id, jobData) => {
  return api.put(`/jobs/${id}`, jobData);
};

export const deleteJob = (id) => {
  return api.delete(`/jobs/${id}`);
};

export const applyJob = (jobId) => {
  return api.post('/applications', { job_id: jobId });
};

// Admin API
export const getUsers = () => {
  return api.get('/users');
};

export const createUser = (userData) => {
  return api.post('/users', userData);
};

export const updateUser = (id, userData) => {
  return api.put(`/users/${id}`, userData);
};

export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};

export const getApplications = () => {
  return api.get('/applications');
};

export const getDashboardStats = () => {
  return Promise.all([
    api.get('/users'),
    api.get('/jobs'),
    api.get('/applications')
  ]).then(([users, jobs, applications]) => ({
    totalUsers: users.length,
    activeJobs: jobs.filter(j => j.status === 'active').length,
    applications: applications.length,
    fillRate: Math.round((applications.length / jobs.length) * 100) || 0
  }));
};

export default api;
// Applications API
export const updateApplication = (id, data) => {
  return api.put(`/applications/${id}`, data);
};
