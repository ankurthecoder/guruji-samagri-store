import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const unitService = {
    getUnits: async () => {
        const response = await axios.get(`${API_URL}/units`, getAuthHeader());
        return response.data;
    },

    createUnit: async (unitData) => {
        const response = await axios.post(`${API_URL}/units`, unitData, getAuthHeader());
        return response.data;
    },

    updateUnit: async (id, unitData) => {
        const response = await axios.put(`${API_URL}/units/${id}`, unitData, getAuthHeader());
        return response.data;
    },

    deleteUnit: async (id) => {
        const response = await axios.delete(`${API_URL}/units/${id}`, getAuthHeader());
        return response.data;
    }
};

export default unitService;
