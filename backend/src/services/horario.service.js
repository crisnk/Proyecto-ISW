"use strict";
import { AppDataSource } from "../config/configDb.js";
import Curso from "../entity/curso.entity.js";
import Imparte from "../entity/imparte.entity.js";
import Materia from "../entity/materia.entity.js";
import User from "../entity/user.entity.js";
import { horarioValidation } from "../validations/horario.validation.js";

const validarDatosHorario = async (ID_materia, ID_curso, rut) => {
  const materia = await AppDataSource.getRepository(Materia).findOneBy({ ID_materia });
  if (!materia) {
    throw new Error("La materia no existe en la base de datos.");
  }

  const curso = await AppDataSource.getRepository(Curso).findOneBy({ ID_curso });
  if (!curso) {
    throw new Error("El curso no existe en la base de datos.");
  }

  const user = await AppDataSource.getRepository(User).findOneBy({ rut });
  if (!user) {
    throw new Error("El RUT no existe en la base de datos.");
  }
};

export const asignaHorarioService = async (horarioData) => {
  const { error } = horarioValidation.validate(horarioData, { abortEarly: false });
  if (error) {
    throw new Error(error.details.map(err => err.message).join(", "));
  }

  const { ID_materia, ID_curso, rut, dia, hora_Inicio, hora_Fin } = horarioData;
  const repository = AppDataSource.getRepository(Imparte);

  const materia = await AppDataSource.getRepository(Materia).findOneBy({ ID_materia });
  if (!materia) {
    throw new Error("La materia no existe en la base de datos.");
  }

  const curso = await AppDataSource.getRepository(Curso).findOneBy({ ID_curso });
  if (!curso) {
    throw new Error("El curso no existe en la base de datos.");
  }

  const user = await AppDataSource.getRepository(User).findOneBy({ rut });
  if (!user) {
    throw new Error("El RUT no existe en la base de datos.");
  }

  const conflictoHorario = await repository.findOne({
    where: [
      { rut, dia, hora_Inicio },
      { ID_curso, dia, hora_Inicio },
    ],
  });

  if (conflictoHorario) {
    throw new Error("Conflicto de horario detectado. El profesor o curso ya tiene una clase en este horario.");
  }

  const nuevoHorario = repository.create({ ID_materia, ID_curso, rut, dia, hora_Inicio, hora_Fin });
  await repository.save(nuevoHorario);

  return nuevoHorario;
};

export const modificaHorarioService = async (id, horarioData) => {
  const { error } = horarioValidation.validate(horarioData, { abortEarly: false });
  if (error) {
    throw new Error(error.details.map(err => err.message).join(", "));
  }

  const { ID_materia, ID_curso, rut } = horarioData;
  await validarDatosHorario(ID_materia, ID_curso, rut);

  const repository = AppDataSource.getRepository(Imparte);
  const horarioExistente = await repository.findOneBy({ id });

  if (!horarioExistente) {
    throw new Error("Horario no encontrado.");
  }

  Object.assign(horarioExistente, horarioData);
  await repository.save(horarioExistente);

  return horarioExistente;
};


export const eliminarHorarioService = async (id) => {
  const repository = AppDataSource.getRepository(Imparte);
  const horario = await repository.findOneBy({ id });

  if (!horario) {
    throw new Error("Horario no encontrado.");
  }

  await repository.remove(horario);
  return horario;
};

export const getHorariosByProfesor = async (rut) => {
  const repository = AppDataSource.getRepository(Imparte);
  const horarios = await repository.find({ where: { rut } });
  if (horarios.length === 0) {
    throw new Error("No se encontraron horarios para este profesor.");
  }
  return horarios;
};

export const getHorariosByCurso = async (ID_curso) => {
  const repository = AppDataSource.getRepository(Imparte);
  const horarios = await repository.find({ where: { ID_curso } });
  if (horarios.length === 0) {
    throw new Error("No se encontraron horarios para este curso.");
  }
  return horarios;
};

export const getAllHorarios = async () => {
  const repository = AppDataSource.getRepository(Imparte);
  const horarios = await repository.find();
  if (horarios.length === 0) {
    throw new Error("No se encontraron horarios.");
  }
  return horarios;
};
