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

const getProducts = async (params = {}) => {
    const response = await axios.get(`${API_URL}/products`, {
        params,
        ...getAuthHeader(),
    });
    return response.data;
};

const getProductById = async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`, getAuthHeader());
    return response.data;
};

const createProduct = async (productData) => {
    const response = await axios.post(`${API_URL}/products`, productData, getAuthHeader());
    return response.data;
};

const updateProduct = async (id, productData) => {
    const response = await axios.put(`${API_URL}/products/${id}`, productData, getAuthHeader());
    return response.data;
};

const deleteProduct = async (id) => {
    const response = await axios.delete(`${API_URL}/products/${id}`, getAuthHeader());
    return response.data;
};

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
            ...getAuthHeader().headers,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

const productService = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
};

export default productService;
