"use strict";
import {
  asignaHorarioService,
  eliminarHorarioService,
  getAllHorarios,
  getHorariosByCurso,
  getHorariosByProfesor,
  modificaHorarioService,
} from "../services/horario.service.js";

export const crearHorario = async (req, res) => {
  try {
    const horarioAsignado = await asignaHorarioService(req.body);
    res.status(201).json({ message: "Horario creado correctamente", horario: horarioAsignado });
  } catch (error) {
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

export const verHorarioProfesor = async (req, res) => {
  try {
    const horarios = await getHorariosByProfesor(req.user.rut);
    res.status(200).json(horarios);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const verHorarioCurso = async (req, res) => {
  try {
    const horarios = await getHorariosByCurso(req.params.ID_curso);
    res.status(200).json(horarios);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const verTodosHorarios = async (req, res) => {
  try {
    const horarios = await getAllHorarios();
    res.status(200).json(horarios);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
