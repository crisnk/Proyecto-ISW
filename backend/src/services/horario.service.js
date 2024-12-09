"use strict";
import { AppDataSource } from "../config/configDb.js";
import Curso from "../entity/curso.entity.js";
import Imparte from "../entity/imparte.entity.js";
import Materia from "../entity/materia.entity.js";
import User from "../entity/user.entity.js";
import Pertenece from "../entity/pertenece.entity.js";
import { sendEmail } from "./email.service.js";
import {
  cursoValidation,
  horarioValidationProfesor,
  paginationAndFilterValidation,
  validarSincronizacionBloque,
  materiaValidation,
} from "../validations/horario.validation.js";

const BLOQUES_HORARIOS = {
  "08:00 - 08:45": { hora_Inicio: "08:00", hora_Fin: "08:45" },
  "08:50 - 09:35": { hora_Inicio: "08:50", hora_Fin: "09:35" },
  "09:40 - 10:25": { hora_Inicio: "09:40", hora_Fin: "10:25" },
  "11:20 - 12:05": { hora_Inicio: "11:20", hora_Fin: "12:05" },
  "12:10 - 12:55": { hora_Inicio: "12:10", hora_Fin: "12:55" },
  "14:30 - 15:15": { hora_Inicio: "14:30", hora_Fin: "15:15" },
  "15:20 - 16:05": { hora_Inicio: "15:20", hora_Fin: "16:05" },
  "16:10 - 16:55": { hora_Inicio: "16:10", hora_Fin: "16:55" },
  "17:00 - 17:45": { hora_Inicio: "17:00", hora_Fin: "17:45" },
};


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
    const { hora_Inicio, hora_Fin } = BLOQUES_HORARIOS[bloque.bloque] || {};
    if (!hora_Inicio || !hora_Fin) {
      throw new Error(`El bloque ${bloque.bloque} no tiene horas asignadas.`);
    }

    validarSincronizacionBloque(bloque.bloque, hora_Inicio, hora_Fin);

    const materia = await materiaRepository.findOneBy({ ID_materia: bloque.ID_materia });
    if (!materia) {
      throw new Error(`La materia con ID ${bloque.ID_materia} no existe.`);
    }

    let horarioExistente = await repository.findOne({
      where: { ID_curso: ID_curso, dia: bloque.dia, bloque: bloque.bloque },
    });

    if (horarioExistente) {
      horarioExistente.hora_Inicio = hora_Inicio;
      horarioExistente.hora_Fin = hora_Fin;
      horarioExistente.ID_materia = bloque.ID_materia;
      await repository.save(horarioExistente);
    } else {
      const nuevoHorario = repository.create({
        ID_materia: bloque.ID_materia,
        ID_curso: ID_curso,
        dia: bloque.dia,
        bloque: bloque.bloque,
        hora_Inicio,
        hora_Fin,
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
    const { hora_Inicio, hora_Fin } = BLOQUES_HORARIOS[bloque.bloque] || {};
    if (!hora_Inicio || !hora_Fin) {
      throw new Error(`El bloque ${bloque.bloque} no tiene horas asignadas.`);
    }

    validarSincronizacionBloque(bloque.bloque, hora_Inicio, hora_Fin);

    let horarioExistente = await repository.findOne({
      where: { rut, dia: bloque.dia, bloque: bloque.bloque },
    });

    if (horarioExistente) {
      horarioExistente.hora_Inicio = hora_Inicio;
      horarioExistente.hora_Fin = hora_Fin;
      horarioExistente.ID_materia = bloque.ID_materia;
      horarioExistente.ID_curso = bloque.ID_curso;
      await repository.save(horarioExistente);
    } else {
      const nuevoHorario = repository.create({
        ID_materia: bloque.ID_materia,
        ID_curso: bloque.ID_curso,
        rut: rut,
        dia: bloque.dia,
        bloque: bloque.bloque,
        hora_Inicio,
        hora_Fin,
      });

      await repository.save(nuevoHorario);
    }
  }

  return { message: "Horario asignado correctamente para el profesor." };
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
    hora_Inicio: horario.hora_Inicio,
    hora_Fin: horario.hora_Fin,
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
    .leftJoinAndSelect("horario.profesor", "profesor")
    .orderBy("horario.dia", "ASC")
    .addOrderBy("horario.bloque", "ASC");

  if (profesor) {
    queryBuilder.andWhere("(profesor.rut = :profesor)", { profesor });
  }

  if (curso) {
    queryBuilder.andWhere("curso.ID_curso = :curso", { curso });
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


export const eliminarHorarioService = async (filters) => {
  const repository = AppDataSource.getRepository(Imparte);

  const whereClause = {};
  if (filters.profesor) {
    whereClause["profesor.rut"] = filters.profesor;
  }
  if (filters.curso) {
    whereClause["curso.ID_curso"] = filters.curso;
  }

  const horarios = await repository.find({ where: whereClause });

  if (horarios.length === 0) {
    throw new Error("No se encontraron horarios para eliminar.");
  }

  await repository.remove(horarios);
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

export const getHorariosByAlumnoService = async (rut) => {
  if (!rut) {
    throw new Error("El RUT del alumno es requerido.");
  }

  const perteneceRepository = AppDataSource.getRepository(Pertenece);
  const imparteRepository = AppDataSource.getRepository(Imparte);

  const pertenece = await perteneceRepository.findOne({
    where: { rut },
    relations: ["curso"],
  });

  if (!pertenece) {
    throw new Error("El alumno no pertenece a ningún curso.");
  }

  const cursoID = pertenece.curso.ID_curso;

  const horarios = await imparteRepository.find({
    where: { ID_curso: cursoID },
    relations: ["materia", "profesor"],
  });

  if (horarios.length === 0) {
    throw new Error("No se encontraron horarios para este curso.");
  }

  return horarios.map((horario) => ({
    dia: horario.dia,
    bloque: horario.bloque,
    nombre_materia: horario.materia?.nombre || "Sin asignar",
    nombre_profesor: horario.profesor?.nombreCompleto || "Sin profesor",
  }));
};

export const notifyProfessor = async (profesorEmail, horarioDetails) => {
    const subject = "Nuevo Horario Asignado";
    const message = `Se ha asignado un nuevo horario a usted. Los detalles son los siguientes:\n\n${horarioDetails}`;

    return await sendEmail(
        profesorEmail,
        subject,
        message,
        `<p>${message.replace(/\n/g, "<br>")}</p>`
    );
};

export const notifyCourse = async (courseEmails, horarioDetails) => {
    const subject = "Nuevo Horario de Curso";
    const message = `Se ha asignado un nuevo horario al curso. Los detalles son:\n\n${horarioDetails}`;

    for (const email of courseEmails) {
        await sendEmail(
            email,
            subject,
            message,
            `<p>${message.replace(/\n/g, "<br>")}</p>`
        );
    }
    return true;
};

export const getEmailsByCursoService = async (ID_curso) => {
  const perteneceRepository = AppDataSource.getRepository(Pertenece);
  
  const estudiantes = await perteneceRepository.find({
    where: { ID_curso },
    relations: ["user"],
    select: ["user.email"],
  });

  if (!estudiantes.length) {
    throw new Error("No se encontraron alumnos para el curso proporcionado.");
  }

  const emails = estudiantes.map((estudiante) => estudiante.user.email);
  return { emails };
}; 

export const getEmailByProfesorService = async (rut) => {
  const profesorRepository = AppDataSource.getRepository(User);

  const profesor = await profesorRepository.findOne({
    where: { rut, rol: "profesor" },
    select: ["email"],
  });

  if (!profesor) {
    throw new Error("No se encontró un profesor con el RUT proporcionado.");
  }

  return { email: profesor.email };
};


export const getHorariosConId = async (filters) => {
  try {
    const { page = 1, limit = 10, profesor, curso } = filters;
    const repository = AppDataSource.getRepository(Imparte);

    const queryBuilder = repository.createQueryBuilder("imparte")
      .leftJoinAndSelect("imparte.curso", "curso")
      .leftJoinAndSelect("imparte.profesor", "profesor")
      .leftJoinAndSelect("imparte.materia", "materia");

    if (profesor) {
      queryBuilder.andWhere("profesor.rut = :profesor", { profesor });
    }
    if (curso) {
      queryBuilder.andWhere("curso.ID_curso = :curso", { curso });
    }

    const [horarios, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: horarios.map((horario) => ({
        ID_imparte: horario.ID_imparte,
        dia: horario.dia,
        bloque: horario.bloque,
        nombre_materia: horario.materia?.nombre || "Sin materia",
        nombre_profesor: horario.profesor?.nombreCompleto || "Sin profesor",
        curso: horario.curso?.nombre || "Sin curso",
      })),
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error en getHorariosConId:", error);
    throw error;
  }
};
