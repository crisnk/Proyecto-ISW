"use strict";
import { AppDataSource } from "../config/configDb.js";
import Imparte from "../entity/imparte.entity.js"; // Asignación de materia y profesor
import Curso from "../entity/curso.entity.js"; // Cursos
import Materia from "../entity/materia.entity.js"; // Materias
import User from "../entity/user.entity.js"; // Usuarios (profesores)

// Servicio para crear un horario
export async function createHorarioService({ dia, hora_inicio, hora_fin, id_materia, id_curso }) {
  try {
    const imparteRepository = AppDataSource.getRepository(Imparte);
    const cursoRepository = AppDataSource.getRepository(Curso);
    const materiaRepository = AppDataSource.getRepository(Materia);

    // Verificamos si el curso y la materia existen
    const curso = await cursoRepository.findOne({ where: { id_Curso: id_curso } });
    const materia = await materiaRepository.findOne({ where: { id_Materia: id_materia } });

    if (!curso) return [null, "Curso no encontrado"];
    if (!materia) return [null, "Materia no encontrada"];

    // Creamos el nuevo horario (imparte)
    const newHorario = imparteRepository.create({
      dia,
      hora_inicio,
      hora_Fin: hora_fin,
      curso,
      materia,
    });

    await imparteRepository.save(newHorario);

    return [newHorario, null];
  } catch (error) {
    console.error("Error al crear horario:", error);
    return [null, error.message];
  }
}

// Servicio para asignar un horario a un profesor
export async function assignHorarioService({ id_horario, id_profesor }) {
  try {
    const imparteRepository = AppDataSource.getRepository(Imparte);
    const profesorRepository = AppDataSource.getRepository(User);

    // Verificamos si el horario (imparte) y el profesor existen
    const horario = await imparteRepository.findOne({ where: { id_Imparte: id_horario } });
    const profesor = await profesorRepository.findOne({ where: { id: id_profesor, rol: "profesor" } });

    if (!horario) return [null, "Horario no encontrado"];
    if (!profesor) return [null, "Profesor no encontrado"];

    // Asignamos el horario al profesor
    horario.profesor = profesor;
    await imparteRepository.save(horario);

    return [horario, null];
  } catch (error) {
    console.error("Error al asignar horario:", error);
    return [null, error.message];
  }
}

// Servicio para obtener los horarios de un profesor
export async function getProfesorHorarioService(profesorId) {
  try {
    const imparteRepository = AppDataSource.getRepository(Imparte);

    const horarios = await imparteRepository.find({
      where: { profesor: { id: profesorId } },
      relations: ["materia", "curso"], // Relacionar con materia y curso
    });

    if (!horarios || horarios.length === 0) return [null, "No se encontraron horarios para el profesor"];

    return [horarios, null];
  } catch (error) {
    console.error("Error al obtener horarios del profesor:", error);
    return [null, error.message];
  }
}

// Servicio para obtener los horarios de un alumno
export async function getAlumnoHorarioService(alumnoId) {
  try {
    const cursoRepository = AppDataSource.getRepository(Curso);
    const imparteRepository = AppDataSource.getRepository(Imparte);

    // Verificamos a qué curso pertenece el alumno
    const curso = await cursoRepository.findOne({
      where: { usuarios: { id: alumnoId } },
      relations: ["usuarios", "imparte"],
    });

    if (!curso) return [null, "El alumno no está asignado a ningún curso"];

    // Obtenemos los horarios para el curso del alumno
    const horarios = await imparteRepository.find({
      where: { curso: { id_Curso: curso.id_Curso } },
      relations: ["materia", "curso"],
    });

    if (!horarios || horarios.length === 0) return [null, "No se encontraron horarios para el curso del alumno"];

    return [horarios, null];
  } catch (error) {
    console.error("Error al obtener horarios del alumno:", error);
    return [null, error.message];
  }
}
