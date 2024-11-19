import { useState, useEffect } from "react";
import { getPracticas } from "@services/practica.service.js";

export default function usePractica() {
    const [practicas, setPracticas] = useState([]);

    const fetchPracticas = async () => {
        try {
            const response = await getPracticas();
            console.log(response);
            const formattedDataa = response.map(practica => ({
                nombre: practica.nombre,
                descripcion: practica.descripcion,
                direccion: practica.direccion,
                fechaPublicacion: practica.createdAt,
                cupo: practica.cupo,

            }))
            console.log(formattedDataa);
            setPracticas(formattedDataa);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchPracticas();
    }, []);
    return { practicas, fetchPracticas, setPracticas };
}