import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Ajustar si se despliega

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar token en headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;