import axios from './root.service.js';

export const justificarAtraso = async (formData) => {
    return axios.post('justificativo/generar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};