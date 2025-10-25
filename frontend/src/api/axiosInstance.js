import axios from 'axios';
import { logout } from '../redux/authSlice';

let store;

// This function is still needed for the response interceptor to dispatch logout
export const injectStore = (_store) => {
  store = _store;
};

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is not set');
}

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// This request interceptor is correct and reads the token from localStorage.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // No need to manually add '/api' here if baseURL includes the domain
    return config;
  },
  (error) => Promise.reject(error)
);

// Updated Response Interceptor (remains the same as your previous good version)
// This interceptor only logs the user out on a 401 error.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is specifically a 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      // Dispatch the logout action to clear the user's session
      if (store) {
        store.dispatch(logout());
      }
    }
    // For all other errors, let the promise reject
    return Promise.reject(error);
  }
);

export default axiosInstance;