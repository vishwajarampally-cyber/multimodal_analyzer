import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers?.['Content-Type'];
  }
  return config;
});

export default api;
