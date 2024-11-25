import { useState, useEffect } from "react";
import { getPracticas } from "@services/practica.service.js";

export default function usePractica() {
    const [practicas, setPracticas] = useState([]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,  // Formato de 24 horas
        });
    };

    const fetchPracticas = async () => {
        try {
            const response = await getPracticas();

            const formattedData = response.map(practica => ({
                ID: practica.ID_practica,
                nombre: practica.nombre,
                descripcion: practica.descripcion,
                direccion: practica.direccion,
                fechaPublicacion: formatDate(practica.createdAt),
                cupo: practica.cupo,
            }));
            
            setPracticas(formattedData);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchPracticas();
    }, []);
    return { practicas, fetchPracticas, setPracticas };
}