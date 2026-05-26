import axios from 'axios';

const defaultBaseUrl = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseUrl,
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers?.['Content-Type'];
  }
  return config;
});

export default api;
