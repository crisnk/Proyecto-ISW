"use strict";
import { AppDataSource } from "../config/configDb.js";
import Imparte from "../entity/imparte.entity.js";
import { sendNotificacion } from "./notificacion.service.js";

export const asignaHorarioService = async (horarioData) => {
    const { ID_materia, ID_curso, rut, dia, hora_Inicio, hora_Fin } = horarioData;

    const horarioExistente = await AppDataSource.getRepository(Imparte).findOne({
        where: { ID_curso, dia, hora_Inicio }
    });

    if (horarioExistente) {
        throw new Error(`Ya existe una asignación en ${dia} a las ${hora_Inicio} para el curso ${ID_curso}`);
    }

    const nuevoHorario = AppDataSource.getRepository(Imparte).create({
        ID_materia,
        ID_curso,
        rut,
        dia,
        hora_Inicio,
        hora_Fin,
    });

    await AppDataSource.getRepository(Imparte).save(nuevoHorario);
    await sendNotificacion(rut, "Nuevo horario asignado", 
        `Materia ${ID_materia},
         Curso ${ID_curso}, Día ${dia} de ${hora_Inicio} a ${hora_Fin}`);

    return nuevoHorario;
};

export const modificaHorarioService = async (id, horarioData) => {
    const { dia, hora_Inicio, hora_Fin } = horarioData;
    const horario = await AppDataSource.getRepository(Imparte).findOneBy({ id });

    if (!horario) {
        throw new Error("Horario no encontrado");
    }

    horario.dia = dia;
    horario.hora_Inicio = hora_Inicio;
    horario.hora_Fin = hora_Fin;

    await AppDataSource.getRepository(Imparte).save(horario);
    await sendNotificacion(horario.rut, "Horario modificado", `Nuevo horario para el curso 
        ${horario.ID_curso} en el día ${dia} de ${hora_Inicio} a ${hora_Fin}`);

    return horario;
};
