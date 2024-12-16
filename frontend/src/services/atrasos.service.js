import axios from './root.service.js';

export async function getAtrasos() {
    try {
        const { data } = await axios.get('/atraso/atrasos');
        return data;
    } catch (error) {
        return error.response.data;
    }
}
export async function getAtrasosAlumnos() {
    try {
        const { data } = await axios.get('/atraso/tablaAlumnos');
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
        return data; // Retorna directamente la data del backend
    } catch (error) {
        return error.response.data;
    }
}

export async function obtenerInfoAtrasosJustificables() {
    try {
        const { data } = await axios.get('/atraso/infoAtrasosJustificables');
        return data;
    } catch (error) {
        return error.response.data;
    }
}
