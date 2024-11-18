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
