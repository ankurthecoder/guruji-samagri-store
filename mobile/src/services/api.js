import apiClient from './apiClient';

/**
 * Verify OTP with backend and authenticate user
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<object>} User data and JWT token
 */
export const verifyOTPWithBackend = async (idToken) => {
    try {
        const response = await apiClient.post('/auth/verify-otp', { idToken });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Complete user profile
 * @param {object} profileData - { name, dateOfBirth, gender }
 * @returns {Promise<object>} Updated user data
 */
export const completeProfile = async (profileData) => {
    try {
        const response = await apiClient.post('/user/profile', profileData);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Get user profile
 * @returns {Promise<object>} User profile data
 */
export const getUserProfile = async () => {
    try {
        const response = await apiClient.get('/user/profile');
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Update user profile
 * @param {object} updates - Profile fields to update
 * @returns {Promise<object>} Updated user data
 */
export const updateUserProfile = async (updates) => {
    try {
        const response = await apiClient.put('/user/profile', updates);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Get all products
 * @param {object} params - Query parameters (category, search, page, limit)
 * @returns {Promise<object>} Products list with pagination
 */
export const getProducts = async (params = {}) => {
    try {
        const response = await apiClient.get('/products', { params });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Get single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<object>} Product data
 */
export const getProductById = async (productId) => {
    try {
        const response = await apiClient.get(`/products/${productId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Create new order
 * @param {object} orderData - Order details
 * @returns {Promise<object>} Created order
 */
export const createOrder = async (orderData) => {
    try {
        const response = await apiClient.post('/orders', orderData);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Get user's orders
 * @param {object} params - Query parameters (status, page, limit)
 * @returns {Promise<object>} Orders list with pagination
 */
export const getOrders = async (params = {}) => {
    try {
        const response = await apiClient.get('/orders', { params });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<object>} Order details
 */
export const getOrderById = async (orderId) => {
    try {
        const response = await apiClient.get(`/orders/${orderId}`);
        return response;
    } catch (error) {
        throw error;
    }
};
