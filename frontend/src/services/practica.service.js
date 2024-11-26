import axios from "./root.service.js";

export async function getPracticas() {
    try {
        const { data } = await axios.get("/practica/all");
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updatePractica(data) {
    try {
        const response = await axios.put(`/practica/modificar/${data.ID_practica}`, data);
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
}