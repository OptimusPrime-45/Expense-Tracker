import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: '/api', // This will be proxied to the backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
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

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  deleteProfile: () => api.delete('/users/profile'),
};

// Transaction API
export const transactionAPI = {
  getTransactions: () => api.get('/transactions'),
  addTransaction: (transactionData) => api.post('/transactions', transactionData),
  updateTransaction: (id, transactionData) => api.put(`/transactions/${id}`, transactionData),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
  exportToCSV: () => {
    const token = localStorage.getItem('token');
    return axios({
      url: '/api/transactions/export/csv',
      method: 'GET',
      responseType: 'blob', // Important for file download
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// Category API
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  addCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export default api;