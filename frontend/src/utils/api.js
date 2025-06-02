// /frontend/src/utils/api.js
import axios from 'axios';

// Si existe VITE_API_URL (definida en Vercel como "https://pryesphere-production.up.railway.app/api"),
// úsala; si no (en local dev), haz fallback a 'http://localhost:5000/api'.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;