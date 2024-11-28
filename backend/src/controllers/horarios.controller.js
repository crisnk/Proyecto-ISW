"use strict";
import {
  asignaHorarioCursoService,
  asignaHorarioProfesorService,
  crearCursoService,
  crearMateriaService,
  getCursosService,
  getEmailProfesorService,
  getEmailsCursosService,
  getHorarioProfesorService,
  getHorarioAlumnoService,
  getHorarioCursoService,
  getMateriasService,
  getProfesoresService,
  notificacionCursoService,
  notificacionProfesorService,
  eliminarCursoService,
  eliminarMateriaService,
  eliminarHorarioCursoService,
  eliminarHorarioProfesorService
} from "../services/horario.service.js";
import { handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export const crearHorarioCurso = async (req, res) => {
  try {
    const result = await asignaHorarioCursoService(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al asignar horario al curso:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const crearHorarioProfesor = async (req, res) => {
  try {
    const result = await asignaHorarioProfesorService(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al asignar horario al profesor:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const verMaterias = async (req, res) => {
  try {
    const materias = await getMateriasService();
    res.status(200).json(materias);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const verCursos = async (req, res) => {
  try {
    const cursos = await getCursosService();
    res.status(200).json(cursos);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const verProfesores = async (req, res) => {
  try {
    const profesores = await getProfesoresService();
    res.status(200).json(profesores);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const verHorarioCurso = async (req, res) => {
  try {
    const horarios = await getHorarioCursoService(req.params.ID_curso);
    res.status(200).json(horarios);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verHorarioProfesor = async (req, res) => {
  try {
    const horarios = await getHorarioProfesorService(req.query.rut);
    res.status(200).json(horarios);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const verHorarioAlumno = async (req, res) => {
  try {
    const result = await getHorarioAlumnoService(req.user.rut); 
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener horarios del alumno:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const crearMateria = async (req, res) => {
  try {
    const nuevaMateria = await crearMateriaService(req.body);
    res.status(201).json({ message: "Materia creada correctamente", materia: nuevaMateria });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const crearCurso = async (req, res) => {
  try {
    const nuevoCurso = await crearCursoService(req.body);
    res.status(201).json({ message: "Curso creado correctamente", curso: nuevoCurso });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const eliminarMateria = async (req, res) => {
  try {
    const { ID_materia } = req.params;
    const materiaEliminada = await eliminarMateriaService(ID_materia);
    res.status(200).json({ message: "Materia eliminada correctamente", materia: materiaEliminada });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const eliminarCurso = async (req, res) => {
  try {
    const { ID_curso } = req.params;
    const cursoEliminado = await eliminarCursoService(ID_curso);
    res.status(200).json({ message: "Curso eliminado correctamente", curso: cursoEliminado });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const eliminarHorarioCurso = async (req, res) => {
  try {
    const { ID_horario } = req.params;
    const resultado = await eliminarHorarioCursoService(ID_horario);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const eliminarHorarioProfesor = async (req, res) => {
  try {
    const { rut } = req.params;
    const { dia, bloque } = req.query;
    const resultado = await eliminarHorarioProfesorService(rut, dia, bloque);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const NotificationProfesor = async (req, res) => {
  try {
      const { email, horarioDetails } = req.body;
      await notificacionProfesorService(email, horarioDetails);
      handleSuccess(res, 200, "Notificación enviada al profesor con éxito.");
  } catch (error) {
      handleErrorServer(res, 500, "Error al enviar la notificación al profesor.", error.message);
  }
};

export const NotificationCurso = async (req, res) => {
  try {
      const { emails, horarioDetails } = req.body;
      await notificacionCursoService(emails, horarioDetails);
      handleSuccess(res, 200, "Notificaciones enviadas al curso con éxito.");
  } catch (error) {
      handleErrorServer(res, 500, "Error al enviar notificaciones al curso.", error.message);
  }
};
export const verEmailProfesor = async (req, res) => {
try {
  const result = await getEmailProfesorService (req.params.rut);
  res.status(200).json(result);
} catch (error) {
  console.error("Error al obtener el correo del profesor:", error.message);
  res.status(400).json({ message: error.message });
}
};
export const verEmailsCurso = async (req, res) => {
try {
  const result = await getEmailsCursosService(req.params.ID_curso);
  res.status(200).json(result);
} catch (error) {
  console.error("Error al obtener los correos del curso:", error.message);
  res.status(400).json({ message: error.message });
}
};
