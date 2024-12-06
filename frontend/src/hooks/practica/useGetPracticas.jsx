import { useState, useEffect } from "react";
import moment from "moment-timezone";
import { getPracticas } from "@services/practica.service.js";

export default function usePractica() {
    const [practicas, setPracticas] = useState([]);

    function getTimeAgo(date) {
        const now = moment(); // Fecha y hora actual
        const publishedDate = moment(date); // Fecha de publicación

        // Diferencias en tiempo:
        const secondsAgo = now.diff(publishedDate, 'seconds');
        const minutesAgo = now.diff(publishedDate, 'minutes');
        const hoursAgo = now.diff(publishedDate, 'hours');
        const daysAgo = now.diff(publishedDate, 'days');

        // Si fue publicado hace menos de 1 minuto
        if (secondsAgo < 60) {
            return `${secondsAgo} segundo${secondsAgo === 1 ? '' : 's'}`;
        }
        // Si fue publicado hace menos de 1 hora
        else if (minutesAgo < 60) {
            return `${minutesAgo} minuto${minutesAgo === 1 ? '' : 's'}`;
        }
        // Si fue publicado hace menos de 1 dia
        else if (hoursAgo < 24) {
            return `${hoursAgo} hora${hoursAgo === 1 ? '' : 's'}`;
        }
        // Si fue publicado hace más de 1 dia
        else {
            return `${daysAgo} día${daysAgo === 1 ? '' : 's'}`;
        }
    }

    const fetchPracticas = async () => {
        try {
            const response = await getPracticas();
            console.log(response);
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