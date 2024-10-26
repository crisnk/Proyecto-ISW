import { AppDataSource } from '../config/configDb.js';
import Imparte from '../entity/imparte.entity.js';
import Curso from '../entity/curso.entity.js'; 
import { sendNotificacion } from '../helpers/notificacion.helper.js';

export const asignaHorario = async (req, res) => {
    const { rol } = req.user;
    if (rol !== "jefeUTP") {
        return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
    }
    
    const { ID_materia, ID_curso, rut, dia, hora_Inicio, hora_Fin } = req.body;

    try {
        const horario = AppDataSource.getRepository(Imparte).create({
            ID_materia,
            ID_curso,
            rut,
            dia,
            hora_Inicio,
            hora_Fin,
        });
        await AppDataSource.getRepository(Imparte).save(horario);
        await sendNotificacion(rut, `Nuevo horario asignado: ${ID_materia} para el curso ${ID_curso}, día ${dia}
             de ${hora_Inicio} a ${hora_Fin}`);

        res.status(201).json({ message: "Horario creado correctamente", horario });
    } catch (error) {
        console.error("Error al asignar horario:", error);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
};

    export const modificaHorario = async (req, res) => {
        const { rol } = request.user;
        if (rol!== "jefeUTP") {
            return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
        }
        const { ID_materia, ID_curso, rut, dia, hora_Inicio, hora_Fin } = req.body;
        
        try{
            const horario = await AppDataSource.getRepository(Imparte).findOneBy({ id });
        if (!horario) return res.status(404).json({ message: "Horario no encontrado" });

        horario.dia = dia;
        horario.hora_Inicio = hora_Inicio;
        horario.hora_Fin = hora_Fin;
        await AppDataSource.getRepository(Imparte).save(horario);

        res.status(200).json({ message: "Horario modificado correctamente", horario });
        } catch (error) {
            console.error("error al modificar horario, Error");
            res.status(500).json({ message: "Error intento del servidor", error });
        }

    };

    export const verHorario = async (req, res) => {
        const { rol, rut } = req.user;
    
        try {
            let horarios;
            if (rol === "jefeUTP") {
                horarios = await AppDataSource.getRepository(Imparte).find();
            } else if (rol === "profesor") {
                horarios = await AppDataSource.getRepository(Imparte).find({ where: { rut } });
            } else if (rol === "alumno") {
                const cursoAlumno = await AppDataSource.getRepository(Pertenece).findOne({ where: { rut } });
                if (!cursoAlumno) return res.status(404).json({ message: "Curso no encontrado para el alumno" });
    
                horarios = await AppDataSource.getRepository(Imparte).find({ 
                    where: { ID_curso: cursoAlumno.ID_curso } });
            }
            res.status(200).json({ horarios });
        } catch (error) {
            console.error("Error al ver horario:", error);
            res.status(500).json({ message: "Error interno del servidor", error });
        }
    };
    
