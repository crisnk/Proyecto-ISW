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

  const nuevoIDHorario = Date.now();  

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
      horarioExistente.ID_horario = nuevoIDHorario;
      await repository.save(horarioExistente);
    } else {
      const nuevoHorario = repository.create({
        ID_materia: bloque.ID_materia,
        ID_curso: ID_curso,
        dia: bloque.dia,
        bloque: bloque.bloque,
        hora_Inicio,
        hora_Fin,
        ID_horario: nuevoIDHorario
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

export const getMateriasService = async () => {
  const repository = AppDataSource.getRepository(Materia);
  const materias = await repository.find();
  if (!materias.length) {
    throw new Error("No se encontraron materias.");
  }
  return materias;
};

export const getCursosService = async () => {
  const repository = AppDataSource.getRepository(Curso);
  const cursos = await repository.find();
  if (!cursos.length) {
    throw new Error("No se encontraron cursos en la base de datos.");
  }
  return cursos;
};

export const getProfesoresService = async () => {
  const repository = AppDataSource.getRepository(User);
  const profesores = await repository.find({ where: { rol: "profesor" } });
  if (!profesores.length) {
    throw new Error("No se encontraron profesores.");
  }
  return profesores;
};


export const getHorarioCursoService = async (ID_curso) => {
  if (!ID_curso || isNaN(ID_curso)) {
    throw new Error("ID_curso debe ser un número válido.");
  }

  const repository = AppDataSource.getRepository(Imparte);
  const horarios = await repository.find({
    where: { ID_curso: Number(ID_curso) },
    relations: ["materia", "profesor"],
    order: {
      ID_horario: "ASC",
      bloque: "ASC",
    },
  });

  if (horarios.length === 0) {
    throw new Error("No se encontraron horarios para el curso proporcionado.");
  }

  return horarios.reduce((acc, horario) => {
    const idHorario = horario.ID_horario;
    if (!acc[idHorario]) {
      acc[idHorario] = [];
    }
    acc[idHorario].push({
      dia: horario.dia,
      bloque: horario.bloque,
      hora_Inicio: horario.hora_Inicio,
      hora_Fin: horario.hora_Fin,
      ID_materia: horario.ID_materia,
      nombre_materia: horario.materia?.nombre || "Materia no disponible",
      rut_profesor: horario.profesor?.rut || null,
      nombre_profesor: horario.profesor?.nombre || "Sin profesor",
    });
    return acc;
  }, {});
};


export const getHorarioProfesorService = async (rut) => {
  if (!rut) {
    throw new Error("Debe proporcionar un RUT válido.");
  }

  const repository = AppDataSource.getRepository(Imparte);
  const horarios = await repository.find({
    where: { rut },
    relations: ["materia", "curso", "profesor"],
    order: {
      dia: "ASC",
      bloque: "ASC",
    },
  });

  if (horarios.length === 0) {
    throw new Error("No se encontraron horarios para el profesor proporcionado.");
  }

  return horarios.map((horario) => ({
    dia: horario.dia,
    bloque: horario.bloque,
    hora_Inicio: horario.hora_Inicio,
    hora_Fin: horario.hora_Fin,
    ID_materia: horario.ID_materia,
    nombre_materia: horario.materia?.nombre || "Materia no disponible",
    ID_curso: horario.curso?.ID_curso,
    nombre_curso: horario.curso?.nombre || "Curso no disponible",
  }));
};

export const getHorarioAlumnoService = async (rut) => {
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

export const eliminarHorarioCursoService = async (ID_horario) => {
  if (!ID_horario || isNaN(ID_horario)) {
    throw new Error("ID_horario debe ser un número válido.");
  }

  const repository = AppDataSource.getRepository(Imparte);
  const resultado = await repository.delete({ ID_horario: Number(ID_horario) });

  if (resultado.affected === 0) {
    throw new Error("No se encontraron horarios para el ID_horario proporcionado.");
  }

  return { message: "Horario del curso eliminado correctamente." };
};


export const eliminarHorarioProfesorService = async (rut, dia, bloque) => {
  if (!rut) {
    throw new Error("Debe proporcionar un RUT válido.");
  }

  const repository = AppDataSource.getRepository(Imparte);

  const condiciones = { rut };
  if (dia) condiciones.dia = dia;
  if (bloque) condiciones.bloque = bloque;

  const resultado = await repository.delete(condiciones);

  if (resultado.affected === 0) {
    throw new Error("No se encontraron bloques de horario para el profesor proporcionado.");
  }

  return { message: "Bloque(s) del horario del profesor eliminado(s) correctamente." };
};

export const notificacionProfesorService = async (profesorEmail, horarioDetails) => {
    const subject = "Nuevo Horario Asignado";
    const message = `Se ha asignado un nuevo horario a usted. Los detalles son los siguientes:\n\n${horarioDetails}`;

    return await sendEmail(
        profesorEmail,
        subject,
        message,
        `<p>${message.replace(/\n/g, "<br>")}</p>`
    );
};

export const notificacionCursoService = async (courseEmails, horarioDetails) => {
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

export const getEmailsCursosService = async (ID_curso) => {
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

export const getEmailProfesorService = async (rut) => {
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
