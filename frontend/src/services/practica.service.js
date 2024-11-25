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
        const response = await axios.patch(`/practica/modificar/${data.ID_practica}`);
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
}