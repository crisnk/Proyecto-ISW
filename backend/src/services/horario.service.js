"use strict";
import { AppDataSource } from "../config/configDb.js";
import Imparte from "../entity/imparte.entity.js";


export const asignaHorarioService = async (horarioData) => {
    const { ID_materia, ID_curso, rut, dia, hora_Inicio, hora_Fin } = horarioData;
    const repository = AppDataSource.getRepository(Imparte);

    
    const conflictoProfesor = await repository.findOne({
        where: {
            rut,
            dia,
            hora_Inicio,
        },
    });

    if (conflictoProfesor) {
        throw new Error("El profesor ya tiene una clase asignada en este horario.");
    }

    const conflictoCurso = await repository.findOne({
        where: {
            ID_curso,
            dia,
            hora_Inicio,
        },
    });

    if (conflictoCurso) {
        throw new Error("El curso ya tiene una clase asignada en este horario.");
    }

    const nuevoHorario = repository.create({
        ID_materia,
        ID_curso,
        rut,
        dia,
        hora_Inicio,
        hora_Fin,
    });

    await repository.save(nuevoHorario);
    return nuevoHorario;
};

export const modificaHorarioService = async (id, horarioData) => {
    const repository = AppDataSource.getRepository(Imparte);
    const horarioExistente = await repository.findOneBy({ id });

    if (!horarioExistente) {
        throw new Error("Horario no encontrado");
    }
    
    const conflictoProfesor = await repository.findOne({
        where: {
            rut: horarioData.rut,
            dia: horarioData.dia,
            hora_Inicio: horarioData.hora_Inicio,
            id: Not(id), 
        },
    });

    if (conflictoProfesor) {
        throw new Error("El profesor ya tiene una clase asignada en este horario.");
    }

    const conflictoCurso = await repository.findOne({
        where: {
            ID_curso: horarioData.ID_curso,
            dia: horarioData.dia,
            hora_Inicio: horarioData.hora_Inicio,
            id: Not(id), 
        },
    });

    if (conflictoCurso) {
        throw new Error("El curso ya tiene una clase asignada en este horario.");
    }

    Object.assign(horarioExistente, horarioData);
    await repository.save(horarioExistente);

    return horarioExistente;
};

export const eliminarHorarioService = async (id) => {
    const repository = AppDataSource.getRepository(Imparte);
    const horario = await repository.findOneBy({ id });
    if (!horario) {
        throw new Error("Horario no encontrado");
    }
    await repository.remove(horario);
    return horario;
};

export const getHorariosByProfesor = async (rut) => {
    const repository = AppDataSource.getRepository(Imparte);
    return await repository.find({ where: { rut } });
};

export const getHorariosByCurso = async (ID_curso) => {
    const repository = AppDataSource.getRepository(Imparte);
    return await repository.find({ where: { ID_curso } });
};

export const getAllHorarios = async () => {
    const repository = AppDataSource.getRepository(Imparte);
    return await repository.find();
};
