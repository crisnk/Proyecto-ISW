"use strict";
import { AppDataSource } from "../config/configDb.js";
import Curso from "../entity/curso.entity.js";
import Imparte from "../entity/imparte.entity.js";
import Materia from "../entity/materia.entity.js";
import User from "../entity/user.entity.js";
import { cursoValidation, horarioValidation, materiaValidation, 
  paginationAndFilterValidation } from "../validations/horario.validation.js";

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

export const getAllHorarios = async (query) => {
  const { error } = paginationAndFilterValidation.validate(query, { abortEarly: false });
  if (error) {
    throw new Error(error.details.map(err => err.message).join(", "));
  }

  const { page = 1, limit = 10, materia, curso, profesor } = query;
  const repository = AppDataSource.getRepository(Imparte);

  const queryBuilder = repository
  .createQueryBuilder("horario")
  .leftJoinAndSelect("horario.materia", "materia")
  .leftJoinAndSelect("horario.curso", "curso")
  .leftJoinAndSelect("horario.profesor", "profesor");

if (materia) {
  queryBuilder.andWhere("materia.ID_materia = :materia", { materia });
}
if (curso) {
  queryBuilder.andWhere("curso.ID_curso = :curso", { curso });
}
if (profesor) {
  queryBuilder.andWhere("profesor.rut = :profesor", { profesor });
}
  const total = await queryBuilder.getCount();
  const data = await queryBuilder
    .skip((page - 1) * limit)
    .take(limit)
    .getMany();

  return {
    data: data.map((horario) => ({
      id: horario.id,
      dia: horario.dia,
      hora_Inicio: horario.hora_Inicio,
      hora_Fin: horario.hora_Fin,
      materia: {
        id: horario.materia.ID_materia,
        nombre: horario.materia.nombre,
      },
      curso: {
        id: horario.curso.ID_curso,
        nombre: horario.curso.nombre,
        aula: horario.curso.aula,
      },
      profesor: {
        rut: horario.profesor.rut,
        nombreCompleto: horario.profesor.nombreCompleto,
      },
    })),
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

export const getMaterias = async () => {
  const repository = AppDataSource.getRepository(Materia);
  const materias = await repository.find();
  if (materias.length === 0) {
    throw new Error("No se encontraron materias.");
  }
  return materias;
};

export const getCursos = async () => {
  const repository = AppDataSource.getRepository(Curso);
  const cursos = await repository.find();
  if (cursos.length === 0) {
    throw new Error("No se encontraron cursos.");
  }
  return cursos;
};

export const getProfesores = async () => {
  const repository = AppDataSource.getRepository(User);
  const profesores = await repository.find({ where: { rol: "profesor" } });
  if (profesores.length === 0) {
    throw new Error("No se encontraron profesores.");
  }
  return profesores;
};

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
export const crearMateriaService = async (materiaData) => {
  const { error } = materiaValidation.validate(materiaData, { abortEarly: false });
  if (error) {
    throw new Error(`Errores de validación: ${error.details.map(err => err.message).join(", ")}`);
  }

  const materiaRepository = AppDataSource.getRepository(Materia);
  const materiaExistente = await materiaRepository.findOneBy({ nombre: materiaData.nombre });
  if (materiaExistente) {
    throw new Error("La materia ya existe.");
  }

  const nuevaMateria = materiaRepository.create(materiaData);
  await materiaRepository.save(nuevaMateria);

  return nuevaMateria;
};

export const crearCursoService = async (cursoData) => {
  const { error } = cursoValidation.validate(cursoData, { abortEarly: false });
  if (error) {
    throw new Error("Errores de validación: " + error.details.map(err => err.message).join(", "));
  }

  const cursoRepository = AppDataSource.getRepository(Curso);
  const cursoExistente = await cursoRepository.findOneBy({ nombre: cursoData.nombre });
  if (cursoExistente) {
    throw new Error("El curso ya existe.");
  }

  const nuevoCurso = cursoRepository.create(cursoData);
  await cursoRepository.save(nuevoCurso);

  return nuevoCurso;
};


export const eliminarMateriaService = async (ID_materia) => {
  const imparteRepository = AppDataSource.getRepository(Imparte);
  const materiaRepository = AppDataSource.getRepository(Materia);
  
  await imparteRepository.delete({ ID_materia });
  
  const materia = await materiaRepository.findOneBy({ ID_materia });
  if (!materia) {
    throw new Error("Materia no encontrada.");
  }
  await materiaRepository.remove(materia);
  return materia;
};


export const eliminarCursoService = async (ID_curso) => {
  const impartirRepository = AppDataSource.getRepository(Imparte);
  const cursoRepository = AppDataSource.getRepository(Curso);

  await impartirRepository.delete({ ID_curso });
  
  const curso = await cursoRepository.findOneBy({ ID_curso });
  if (!curso) {
    throw new Error("Curso no encontrado.");
  }
  await cursoRepository.remove(curso);
  return curso;
};


