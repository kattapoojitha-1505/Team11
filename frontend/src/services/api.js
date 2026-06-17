import axios from 'axios';
import { API_URL, INITIAL_MOCK_PROJECTS } from '../utils/constants';

// Initialize mock DB in localStorage if it doesn't exist
if (!localStorage.getItem('nimbus_mock_projects')) {
  localStorage.setItem('nimbus_mock_projects', JSON.stringify(INITIAL_MOCK_PROJECTS));
}

const mockUsers = [
  { id: 1, username: 'Srinivas K', email: 'srini@nimbus.dev', password: 'password' },
  { id: 2, username: 'Jane Doe', email: 'jane@nimbus.dev', password: 'password' },
  { id: 3, username: 'Alex Rivers', email: 'alex@nimbus.dev', password: 'password' }
];

if (!localStorage.getItem('nimbus_mock_users')) {
  localStorage.setItem('nimbus_mock_users', JSON.stringify(mockUsers));
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Inject Authorization Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nimbus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Custom fetcher wrapper that executes Axios, falling back to mock logic if the server is offline.
 */
export const requestHandler = async (axiosCall, mockFallbackFn) => {
  try {
    const response = await axiosCall();
    return response.data;
  } catch (error) {
    // If connection is refused, server offline (no response), or 404
    if (!error.response || error.code === 'ERR_NETWORK' || error.response.status === 404) {
      console.warn(`[API MOCK FALLBACK] Server is unreachable or resource missing. Executing local simulated action.`, error);
      return mockFallbackFn();
    }
    throw error;
  }
};

export default api;
