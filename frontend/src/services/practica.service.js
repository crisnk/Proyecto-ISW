import axios from "./root.service.js";

export async function getPracticas() {
    try {
        const { data } = await axios.get("/practica/all");
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updatePractica(ID_practica, data) {
    try {
        const response = await axios.put(`/practica/modificar/${ID_practica}`, data);
        return response.status;
    } catch (error) {
        return error.response.data;
    }
}

export async function createPractica(data) {
    try {
        const response = await axios.post("/practica/crear", data);
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function postularPractica(ID_practica) {
    try {
        const response = await axios.post(`/practica/postular/${ID_practica}`);
        return response;
    } catch (error) {
        return error.response.data;
    }
}

export async function cancelarPostulacion(ID_practica) {
    try {
        const response = await axios.delete(`/practica/postulacion/${ID_practica}`);
        return response;
    } catch (error) {
        return error.response.data;
    }
}

export async function getPostulaciones() {
    try {
        const response = await axios.get(`/practica/postulaciones`);
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
}