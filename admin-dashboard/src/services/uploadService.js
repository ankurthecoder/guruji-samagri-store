import apiClient from './api';

const uploadService = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await apiClient.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    },
};

export default uploadService;
