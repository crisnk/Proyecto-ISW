import axios from './root.service.js';

export async function getAtrasos() {
    try {
        const { data } = await axios.get('/atraso/atrasos');
        return data;
    } catch (error) {
        return error.response.data;
    }
}

export async function obtenerInfoAtraso() {
    try {
        const { data } = await axios.get('/atraso/infoAtraso');
        return data;
    } catch (error) {
        return error.response.data;
    }
}

export async function registrarAtrasos() {
    try {
        const { data } = await axios.post('/atraso/registrar');
        return data;
    } catch (error) {
        return error.response.data;
    }
}
