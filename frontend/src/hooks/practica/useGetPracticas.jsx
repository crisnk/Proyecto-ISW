import { useState, useEffect } from "react";
import { getTimeAgo } from "../../helpers/getTimeAgo";
import { getPracticas } from "@services/practica.service.js";

export default function useGetPractica() {
    const [practicas, setPracticas] = useState([]);

    const fetchPracticas = async () => {
        try {
            const response = await getPracticas();

            const formattedData = response.map(practica => ({
                ID: practica.ID_practica,
                nombre: practica.nombre,
                descripcion: practica.descripcion,
                direccion: practica.direccion,
                fechaPublicacion: getTimeAgo(practica.createdAt),
                cupo: practica.cupo,
                estado: practica.estado,
                nombreEspecialidad: practica.ID_especialidad.nombre,
                ID_especialidad: practica.ID_especialidad.ID_especialidad
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