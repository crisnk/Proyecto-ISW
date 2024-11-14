import axios from "./root.service.js";

export async function getPracticas() {
    try {
        const { data } = await axios.get("/practica/all");
        console.log(data);
        return data;
    } catch (error) {
        return error.response.data;
    }
}