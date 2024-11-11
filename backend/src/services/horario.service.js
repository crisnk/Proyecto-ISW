"use strict";
import { AppDataSource } from "../config/configDb.js";
import Curso from "../entity/curso.entity.js";
import Imparte from "../entity/imparte.entity.js";
import Materia from "../entity/materia.entity.js";
import User from "../entity/user.entity.js";
import {
  cursoValidation,
  horarioValidationCurso,
  horarioValidationProfesor,
  materiaValidation,
  paginationAndFilterValidation,
  validarHorario,
} from "../validations/horario.validation.js";

export const asignaHorarioCursoService = async (horarioData) => {
  const { ID_curso, horario } = horarioData;

  if (!ID_curso) {
    throw new Error("Debe proporcionar ID_curso.");
  }

  const cursoRepository = AppDataSource.getRepository(Curso);
  const curso = await cursoRepository.findOneBy({ ID_curso });
  if (!curso) {
    throw new Error(`El curso con ID ${ID_curso} no existe.`);
  }

  const materiaRepository = AppDataSource.getRepository(Materia);
  const repository = AppDataSource.getRepository(Imparte);

  for (const bloque of horario) {
    const materia = await materiaRepository.findOneBy({ ID_materia: bloque.ID_materia });
    if (!materia) {
      throw new Error(`La materia con ID ${bloque.ID_materia} no existe.`);
    }

    const { error } = horarioValidationCurso.validate(bloque, { abortEarly: false });
    if (error) {
      throw new Error(error.details.map((e) => e.message).join(", "));
    }

    validarHorario(bloque.dia, bloque.bloque);

    let horarioExistente = await repository.findOne({
      where: { ID_curso: ID_curso, dia: bloque.dia, bloque: bloque.bloque },
    });

    if (horarioExistente) {
      horarioExistente.ID_materia = bloque.ID_materia;
      await repository.save(horarioExistente); 
    } else {
      const nuevoHorario = repository.create({
        ID_materia: bloque.ID_materia,
        ID_curso: ID_curso,
        rut: null, 
        dia: bloque.dia,
        bloque: bloque.bloque,
      });

      await repository.save(nuevoHorario); 
    }
  }

  return { message: "Horario asignado correctamente para el curso." };
};


export const asignaHorarioProfesorService = async (horarioData) => {
  const { rut, horario } = horarioData;

  const { error: validationError } = horarioValidationProfesor.validate(horarioData, { abortEarly: false });
  if (validationError) {
    throw new Error(validationError.details.map((e) => e.message).join(", "));
  }

  const profesorRepository = AppDataSource.getRepository(User);
  const profesor = await profesorRepository.findOneBy({ rut, rol: "profesor" });
  if (!profesor) {
    throw new Error("El profesor con el RUT proporcionado no existe o no tiene el rol adecuado.");
  }
  const repository = AppDataSource.getRepository(Imparte);

  for (const bloque of horario) {
    validarHorario(bloque.dia, bloque.bloque);

    let horarioExistente = await repository.findOne({
      where: { rut, dia: bloque.dia, bloque: bloque.bloque },
    });

    if (horarioExistente) {
 
      horarioExistente.ID_materia = bloque.ID_materia;
      horarioExistente.ID_curso = bloque.ID_curso;
      await repository.save(horarioExistente);
    } else {

      const conflictoHorario = await repository.findOne({
        where: { dia: bloque.dia, bloque: bloque.bloque, rut },
      });

      if (conflictoHorario) {
        throw new Error(
          `Conflicto de horario: El profesor con RUT
           ${rut} ya tiene asignado el bloque ${bloque.bloque} el día ${bloque.dia}.`
        );
      }

      const nuevoHorario = repository.create({
        ID_materia: bloque.ID_materia,
        ID_curso: bloque.ID_curso,
        rut: rut,
        dia: bloque.dia,
        bloque: bloque.bloque,
      });

      await repository.save(nuevoHorario);
    }
  }

  return { message: "Horario asignado correctamente para el profesor." };
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

export const getHorariosByCursoService = async (ID_curso) => {
  if (!ID_curso || isNaN(ID_curso)) {
    throw new Error("ID_curso debe ser un número válido.");
  }

  const repository = AppDataSource.getRepository(Imparte);

  const horarios = await repository.find({
    where: { ID_curso: Number(ID_curso) },
    relations: ["materia", "profesor"], 
  });

  if (horarios.length === 0) {
    throw new Error("No se encontraron horarios para el curso proporcionado.");
  }

  return horarios.map((horario) => ({
    dia: horario.dia,
    bloque: horario.bloque,
    ID_materia: horario.ID_materia,
    nombre_materia: horario.materia?.nombre || "Materia no disponible",
    rut_profesor: horario.profesor?.rut || null,
    nombre_profesor: horario.profesor?.nombre || "Sin profesor",
  }));
};

export const getAllHorarios = async (query) => {
  const { error, value } = paginationAndFilterValidation.validate(query, { abortEarly: false });
  if (error) {
    throw new Error(error.details.map((err) => err.message).join(", "));
  }

  const { profesor, curso, page = 1, limit = 10 } = value;
  const repository = AppDataSource.getRepository(Imparte);

  const queryBuilder = repository
    .createQueryBuilder("horario")
    .leftJoinAndSelect("horario.materia", "materia")
    .leftJoinAndSelect("horario.curso", "curso")
    .leftJoinAndSelect("horario.profesor", "profesor");

  if (profesor) {
    queryBuilder.andWhere(
      "(profesor.rut = :profesor OR LOWER(profesor.nombreCompleto) = LOWER(:profesor))",
      { profesor }
    );
  }

  if (curso) {
    queryBuilder.andWhere("curso.nombre = :curso", { curso });
  }

  const total = await queryBuilder.getCount();
  const data = await queryBuilder
    .skip((page - 1) * limit)
    .take(limit)
    .getMany();

  return {
    data,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

export const getHorarioProfesor = async (rut) => {
  const repository = AppDataSource.getRepository(Imparte);
  return await repository.find({
    where: { rut },
    relations: ["materia", "curso", "profesor"],
  });
};

export const getCursos = async () => {
  const repository = AppDataSource.getRepository(Curso);
  const cursos = await repository.find();
  if (!cursos.length) {
    throw new Error("No se encontraron cursos en la base de datos.");
  }
  return cursos;
};

export const getMaterias = async () => {
  const repository = AppDataSource.getRepository(Materia);
  const materias = await repository.find();
  if (!materias.length) {
    throw new Error("No se encontraron materias.");
  }
  return materias;
};

export const getProfesores = async () => {
  const repository = AppDataSource.getRepository(User);
  const profesores = await repository.find({ where: { rol: "profesor" } });
  if (!profesores.length) {
    throw new Error("No se encontraron profesores.");
  }
  return profesores;
};

export const crearMateriaService = async (materiaData) => {
  const { error } = materiaValidation.validate(materiaData, { abortEarly: false });
  if (error) {
    throw new Error(`Errores de validación: ${error.details.map((err) => err.message).join(", ")}`);
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
    throw new Error("Errores de validación: " + error.details.map((err) => err.message).join(", "));
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
