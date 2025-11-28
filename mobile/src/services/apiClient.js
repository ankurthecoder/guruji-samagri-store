import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../constants/config';
import useAuthStore from '../stores/authStore';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // Server responded with error
            const { status, data } = error.response;

            // Handle 401 - Unauthorized
            if (status === 401) {
                useAuthStore.getState().logout();
            }

            return Promise.reject({
                status,
                message: data.message || 'An error occurred',
                errors: data.errors || [],
            });
        } else if (error.request) {
            // Request made but no response
            return Promise.reject({
                message: 'Network error. Please check your connection.',
            });
        } else {
            // Error in request setup
            return Promise.reject({
                message: error.message || 'An error occurred',
            });
        }
    }
);

export default apiClient;
