import axios from './root.service.js';


export async function justificarAtraso(formData) {
    try {
        const response = await axios.post('/justificativo/generar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
}