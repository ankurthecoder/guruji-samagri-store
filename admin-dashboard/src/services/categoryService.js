import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const categoryService = {
    getCategories: async () => {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    },

    createCategory: async (categoryData) => {
        const token = localStorage.getItem('adminToken');
        const response = await axios.post(`${API_URL}/categories`, categoryData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateCategory: async (id, categoryData) => {
        const token = localStorage.getItem('adminToken');
        const response = await axios.put(`${API_URL}/categories/${id}`, categoryData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    deleteCategory: async (id) => {
        const token = localStorage.getItem('adminToken');
        const response = await axios.delete(`${API_URL}/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default categoryService;
