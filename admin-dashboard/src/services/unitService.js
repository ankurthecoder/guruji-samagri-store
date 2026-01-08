import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const unitService = {
    getUnits: async () => {
        const response = await axios.get(`${API_URL}/units`);
        return response.data;
    },

    createUnit: async (unitData) => {
        const token = localStorage.getItem('adminToken');
        const response = await axios.post(`${API_URL}/units`, unitData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default unitService;
