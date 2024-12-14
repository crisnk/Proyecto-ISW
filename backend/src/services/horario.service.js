"use strict";
import { AppDataSource } from "../config/configDb.js";
import Curso from "../entity/curso.entity.js";
import Imparte from "../entity/imparte.entity.js";
import Materia from "../entity/materia.entity.js";
import User from "../entity/user.entity.js";
import Pertenece from "../entity/pertenece.entity.js";
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { sendEmail } from "./email.service.js";
import {
  cursoValidation,
  horarioValidationProfesor,
  validarSincronizacionBloque,
  materiaValidation,
  horarioValidationCurso,
  bloquesHorarios
} from "../validations/horario.validation.js";

export const asignaHorarioCursoService = async (horarioData) => {
  const { ID_curso, horario } = horarioData;

  const repositories = {
    materia: AppDataSource.getRepository(Materia),
    imparte: AppDataSource.getRepository(Imparte),
    curso: AppDataSource.getRepository(Curso),
  };
  if (!ID_curso) {
    throw new Error("La asignación de horario requiere un ID_curso válido.");
  }
  const curso = await repositories.curso.findOneBy({ ID_curso });
  if (!curso) {
    throw new Error(`El curso con ID ${ID_curso} no existe.`);
  }
  try {
    horario.forEach((bloquehoras) => {
      const { error } = horarioValidationCurso.validate(bloquehoras, { abortEarly: false });
      if (error) {
        throw new Error(`Error de validación en el bloque: ${error.details.map((d) => d.message).join(", ")}`);
      }
    });
  } catch (error) {
    throw new Error(`Validación fallida: ${error.message}`);
  }

  for (const bloquehoras of horario) {
    const { hora_Inicio, hora_Fin } = bloquesHorarios[bloquehoras.bloque] || {};
    if (!hora_Inicio || !hora_Fin) {
      throw new Error(`El bloque ${bloquehoras.bloque} no tiene horas asignadas.`);
    }

    validarSincronizacionBloque(bloquehoras.bloque, hora_Inicio, hora_Fin);

    const materia = await repositories.materia.findOneBy({ ID_materia: bloquehoras.ID_materia });
    if (!materia) {
      throw new Error(`La materia con ID ${bloquehoras.ID_materia} no existe.`);
    }

    let horarioExistente = await repositories.imparte.findOne({
      where: {
        dia: bloquehoras.dia,
        bloque: bloquehoras.bloque,
        hora_Inicio,
        hora_Fin,
      },
    });

    if (horarioExistente) {
      horarioExistente.ID_curso = ID_curso;
      horarioExistente.ID_materia = bloquehoras.ID_materia;
      await repositories.imparte.save(horarioExistente);
    } else {
      const nuevoHorario = repositories.imparte.create({
        ID_curso,
        ID_materia: bloquehoras.ID_materia,
        dia: bloquehoras.dia,
        bloque: bloquehoras.bloque,
        hora_Inicio,
        hora_Fin,
      });
      await repositories.imparte.save(nuevoHorario);
    }
  }

  return { message: "Horario asignado o editado correctamente para el curso." };
};


export const asignaHorarioProfesorService = async (horarioData) => {
  const { error } = horarioValidationProfesor.validate(horarioData, { abortEarly: false });
  if (error) {
    throw new Error(
      `Validación fallida: ${error.details.map((d) => d.message).join(", ")}`
    );
  }

  const { rut, horario } = horarioData;
  const profesorRepository = AppDataSource.getRepository(User);
  const repository = AppDataSource.getRepository(Imparte);

  const profesor = await profesorRepository.findOneBy({ rut, rol: "profesor" });
  if (!profesor) {
    throw new Error("El profesor con el RUT proporcionado no existe o no tiene el rol adecuado.");
  }

  for (const bloquehoras of horario) {
    const { hora_Inicio, hora_Fin } = bloquesHorarios[bloquehoras.bloque] || {};
    if (!hora_Inicio || !hora_Fin) {
      throw new Error(`El bloque ${bloquehoras.bloque} no tiene horas asignadas.`);
    }

    validarSincronizacionBloque(bloquehoras.bloque, hora_Inicio, hora_Fin);

    let horarioExistente = await repository.findOne({
      where: {
        dia: bloquehoras.dia,
        bloque: bloquehoras.bloque,
        hora_Inicio,
        hora_Fin,
      },
    });

    if (horarioExistente) {
      horarioExistente.rut = rut;
      horarioExistente.ID_curso = bloquehoras.ID_curso;
      horarioExistente.ID_materia = bloquehoras.ID_materia;
      await repository.save(horarioExistente);
    } else {
      const nuevoHorario = repository.create({
        rut,
        ID_curso: bloquehoras.ID_curso,
        ID_materia: bloquehoras.ID_materia,
        dia: bloquehoras.dia,
        bloque: bloquehoras.bloque,
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
  if (!ID_curso || isNaN(Number(ID_curso))) {
    throw new Error("ID_curso debe ser un número válido.");
  }

  const repository = AppDataSource.getRepository(Imparte);

  const horarios = await repository.find({
    where: { ID_curso: Number(ID_curso) },
    relations: ["materia", "profesor"],
    order: { bloque: "ASC", dia: "ASC" },
  });

  if (horarios.length === 0) {
    throw new Error("No se encontraron horarios para el curso proporcionado.");
  }

  return horarios.map((horario) => ({
    dia: horario.dia,
    bloque: horario.bloque,
    hora_Inicio: horario.hora_Inicio,
    hora_Fin: horario.hora_Fin,
    ID_materia: horario.materia?.ID_materia || null,
    nombre_materia: horario.materia?.nombre || "Materia no disponible",
    rut_profesor: horario.profesor?.rut || null,
    nombre_profesor: horario.profesor?.nombreCompleto || "Sin profesor",
  }));
};

export const getHorarioProfesorService = async (rut) => {
  if (!rut) {
    throw new Error("Debe proporcionar un RUT válido.");
  }

  const repository = AppDataSource.getRepository(Imparte);

  const horarios = await repository.find({
    where: { rut },
    relations: ["materia", "curso"],
    order: { dia: "ASC", bloque: "ASC" },
  });

  if (horarios.length === 0) {
    throw new Error("No se encontraron horarios para el profesor proporcionado.");
  }

  return horarios.map((horario) => ({
    dia: horario.dia,
    bloque: horario.bloque,
    hora_Inicio: horario.hora_Inicio,
    hora_Fin: horario.hora_Fin,
    ID_materia: horario.materia?.ID_materia || null,
    nombre_materia: horario.materia?.nombre || "Materia no disponible",
    ID_curso: horario.curso?.ID_curso || null,
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
  const nombreCurso = pertenece.curso.nombre;

  const horarios = await imparteRepository.find({
    where: { ID_curso: cursoID },
    relations: ["materia", "profesor"],
    order: { dia: "ASC", bloque: "ASC" },
  });

  if (horarios.length === 0) {
    throw new Error("No se encontraron horarios para este curso.");
  }

  return horarios.map((horario) => ({
    dia: horario.dia,
    bloque: horario.bloque,
    hora_Inicio: horario.hora_Inicio,
    hora_Fin: horario.hora_Fin,
    nombre_materia: horario.materia?.nombre || "Sin asignar",
    nombre_profesor: horario.profesor?.nombreCompleto || "Sin profesor",
    nombre_curso: nombreCurso,
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

export const eliminarHorarioCursoService = async (ID_curso, dia, bloque) => {
  if (!ID_curso || isNaN(ID_curso)) {
    throw new Error("ID_curso debe ser un número válido.");
  }
  if (!dia || typeof dia !== "string") {
    throw new Error("Debe proporcionar un día válido.");
  }
  if (!bloque || typeof bloque !== "string") {
    throw new Error("Debe proporcionar un bloque válido.");
  }

  const repository = AppDataSource.getRepository(Imparte);
  const resultado = await repository.delete({
    ID_curso: Number(ID_curso),
    dia: dia.trim(),
    bloque: bloque.trim(),
  });

  if (resultado.affected === 0) {
    throw new Error("No se encontró un horario con los criterios proporcionados.");
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

export const exportarHorarioService = async (type, identifier, user) => {
  const { rol, rut } = user;
  let horarios;
  
  if (rol === 'alumno') {
    if (type !== 'alumno' || identifier !== rut) {
      throw new Error('No tiene permisos para exportar este horario.');
    }
    horarios = await getHorarioProfesor(identifier); 
  } else if (rol === 'profesor') {
    if (type === 'profesor' && identifier !== rut) {
      throw new Error('No tiene permisos para exportar el horario de otro profesor.');
    }
    horarios = type === 'curso' ? await getHorarioCursoService(identifier) : await getHorarioProfesor(identifier);
  } else if (rol === 'jefeUTP' || rol === 'administrador') {
    horarios = type === 'curso' ? await getHorarioCursoService(identifier) : await getHorarioProfesor(identifier);
  } else {
    throw new Error('Rol no autorizado para exportar horarios.');
  }
 
  if (!horarios || Object.keys(horarios).length === 0) {
    throw new Error('No se encontraron horarios para exportar.');
  }
  
  const doc = new PDFDocument();
  const fileName = `horario_${type}_${identifier}.pdf`;
  const writeStream = fs.createWriteStream(fileName);
  doc.pipe(writeStream);

  doc.fontSize(20).text(`Horario ${type === 'curso' ? `del curso ${identifier}` : `del profesor con RUT ${identifier}`}`, { align: 'center' });
  doc.moveDown();

  Object.keys(horarios).forEach((idHorario) => {
    horarios[idHorario].forEach((horario) => {
      doc.fontSize(14).text(`Día: ${horario.dia}`);
      doc.text(`Bloque: ${horario.bloque}`);
      doc.text(`Hora de Inicio: ${horario.hora_Inicio}`);
      doc.text(`Hora de Fin: ${horario.hora_Fin}`);
      doc.text(`Materia: ${horario.nombre_materia}`);
      if (type === 'profesor') {
        doc.text(`Curso: ${horario.nombre_curso}`);
      }
      doc.moveDown();
    });
    doc.addPage();
  });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      resolve(fileName);
    });
    writeStream.on('error', (error) => {
      reject(new Error(`Error al generar el PDF: ${error.message}`));
    });
  });
};