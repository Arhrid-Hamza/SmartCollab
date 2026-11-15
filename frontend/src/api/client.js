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

// Origine du backend (ex. http://localhost:8081) pour afficher les fichiers servis par /uploads/...
export const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();

// "/uploads/avatars/xxx.png" -> "http://localhost:8081/uploads/avatars/xxx.png"
export const assetUrl = (path) => {
  if (!path) return '';
  return /^(https?:|data:|blob:)/.test(path) ? path : `${API_ORIGIN}${path}`;
};

export default api;
