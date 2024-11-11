"use strict";
import {
  asignaHorarioService,
  asignarProfesorAHorarioService,
  crearCursoService,
  crearMateriaService,
  eliminarCursoService,
  eliminarHorarioService,
  eliminarMateriaService,
  getAllHorarios,
  getCursos,
  getHorariosByCursoService,
  getHorariosByProfesor,
  getMaterias,
  getProfesores,
  modificaHorarioService
} from "../services/horario.service.js";

export const crearHorario = async (req, res) => {
  try {
    const horarioAsignado = await asignaHorarioService(req.body);
    res.status(201).json({ message: "Horario creado correctamente", horario: horarioAsignado });
  } catch (error) {  
    console.error("Error al asignar horario:", error);
    res.status(400).json({ message: error.message });
  }
};


export const modificarHorario = async (req, res) => {
  try {
    const horarioModificado = await modificaHorarioService(req.params.id, req.body);
    res.status(200).json({ message: "Horario modificado correctamente", horario: horarioModificado });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const eliminarHorario = async (req, res) => {
  try {
    const horarioEliminado = await eliminarHorarioService(req.params.id);
    res.status(200).json({ message: "Horario eliminado correctamente", horario: horarioEliminado });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verMaterias = async (req, res) => {
  try {
    const materias = await getMaterias();
    res.status(200).json(materias);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const verCursos = async (req, res) => {
  try {
    const cursos = await getCursos();
    res.status(200).json(cursos);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const asignarProfesorAHorario = async (req, res) => {
  try {
    const result = await asignarProfesorAHorarioService(req.params.idHorario, req.body.rut);
    res.status(200).json({ message: "Profesor asignado correctamente", horario: result });
  } catch (error) {
    console.error("Error al asignar profesor al horario:", error);
    res.status(400).json({ message: error.message });
  }
};

export const verProfesores = async (req, res) => {
  try {
    const profesores = await getProfesores();
    res.status(200).json(profesores);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const verHorarioProfesor = async (req, res) => {
  try {
    const horarios = await getHorariosByProfesor(req.query.rut, req.user.rut);
    res.status(200).json(horarios);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const verHorarioCurso = async (req, res) => {
  try {
    const result = await getHorariosByCursoService(req.params.ID_curso);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener horario del curso:", error);
    res.status(500).json({ message: error.message });
  }
};



export const verTodosHorarios = async (req, res) => {
  try {
    const horarios = await getAllHorarios(req.query);
    res.status(200).json(horarios);
  } catch (error) {
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



