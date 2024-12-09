import axios from './root.service.js';

export async function aprobarJustificativo() {
    try {
        const { data } = await axios.post(`/justificativo/aprobar/${ID_atraso}`);
        return data;
    } catch (error) {
        return error.response.data;
    }
}
export async function rechazarJustificativo() {
    try {
        const { data } = await axios.post(`/justificativo/rechazar/${ID_atraso}`);
        return data;
    } catch (error) {
        return error.response.data;
    }
}