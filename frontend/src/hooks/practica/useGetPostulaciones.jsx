import { useState, useEffect } from "react";
import { getTimeAgo } from "../../helpers/getTimeAgo";
import { getPostulaciones } from "@services/practica.service.js";

export default function useGetPostulaciones() {
    const [postulaciones, setPostulaciones] = useState([]);

    const fetchPostulaciones = async () => {
        try {
            const response = await getPostulaciones();
            
            const formattedData = response.map(postulacion => ({
                ID_postulacion: postulacion.ID_postulacion,
                ID_practica: postulacion.ID_practica.ID_practica,
                nombre: postulacion.ID_practica.nombre,
                descripcion: postulacion.ID_practica.descripcion,
                nombreEspecialidad: postulacion.ID_practica.ID_especialidad.nombre,
                direccion: postulacion.ID_practica.direccion,
                publicadoHace: getTimeAgo(postulacion.ID_practica.createdAt),
                cupo: postulacion.ID_practica.cupo,
                estadoPostulacion: postulacion.estado,
            }));

            setPostulaciones(formattedData);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        fetchPostulaciones();
    }, []);

    return { postulaciones, fetchPostulaciones, setPostulaciones };
}