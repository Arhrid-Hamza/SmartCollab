import axios from 'axios';

// Defaults to direct auth-service (port 8081) for Sprint 1, or Gateway (port 8080) when enabled
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject JWT token in Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('emsicollab_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('emsicollab_token');
      localStorage.removeItem('emsicollab_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (err, fallback = 'Une erreur est survenue') => {
  if (!err?.response) {
    return 'Service indisponible. Vérifiez que le backend est démarré.';
  }
  const { status, data } = err.response;
  if (typeof data === 'string' && data.trim()) {
    return data;
  }
  if (data?.message) {
    return data.message;
  }
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors[0].defaultMessage || data.errors[0].message || fallback;
  }
  if (status === 401) {
    return 'Email ou mot de passe incorrect.';
  }
  if (status === 400) {
    return 'Requête invalide. Vérifiez le format de votre adresse @emsi-edu.ma.';
  }
  return fallback;
};

export default api;
