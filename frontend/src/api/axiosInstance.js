import axios from 'axios';
import { logout } from '../redux/authSlice';
import dotenv from 'dotenv';
dotenv.config();

let store;

// This function is still needed for the response interceptor to dispatch logout
export const injectStore = (_store) => {
  store = _store;
};

// --- THIS IS THE FIX ---
// Set the baseURL directly from the environment variable
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use the full URL from .env
});
console.log('API URL:', import.meta.env.VITE_API_URL);

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