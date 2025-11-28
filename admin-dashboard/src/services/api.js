import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            // Handle 401 - Unauthorized
            if (status === 401 && window.location.pathname !== '/login') {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                window.location.href = '/login';
            }

            return Promise.reject({
                status,
                message: data.message || 'An error occurred',
                errors: data.errors || [],
            });
        }

        return Promise.reject({
            message: 'Network error. Please check your connection.',
        });
    }
);

export default apiClient;
