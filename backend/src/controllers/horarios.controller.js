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
        return res.status(201).json({ message: "Horario creado correctamente", horario: horarioAsignado });
    } catch (error) {
        console.error("Error al crear el horario:", error);
        return res.status(400).json({ message: error.message });
    }
};

export const modificarHorario = async (req, res) => {
    try {
        const { id } = req.params;
        const horarioModificado = await modificaHorarioService(id, req.body);
        return res.status(200).json({ message: "Horario modificado correctamente", horario: horarioModificado });
    } catch (error) {
        console.error("Error al modificar el horario:", error);
        return res.status(400).json({ message: error.message });
    }
};

export const eliminarHorario = async (req, res) => {
    try {
        const { id } = req.params;
        const horarioEliminado = await eliminarHorarioService(id);
        return res.status(200).json({ message: "Horario eliminado correctamente", horario: horarioEliminado });
    } catch (error) {
        console.error("Error al eliminar el horario:", error);
        return res.status(400).json({ message: error.message });
    }
};

export const verHorarioProfesor = async (req, res) => {
    try {
        const { rut } = req.user;
        const horarios = await getHorariosByProfesor(rut);
        return res.status(200).json(horarios);
    } catch (error) {
        console.error("Error al obtener el horario del profesor:", error);
        return res.status(500).json({ message: "Error interno del servidor", error });
    }
};

export const verHorarioCurso = async (req, res) => {
    try {
        const { ID_curso } = req.params;
        const horarios = await getHorariosByCurso(ID_curso);
        return res.status(200).json(horarios);
    } catch (error) {
        console.error("Error al obtener el horario del curso:", error);
        return res.status(500).json({ message: "Error interno del servidor", error });
    }
};

export const verTodosHorarios = async (req, res) => {
    try {
        const horarios = await getAllHorarios();
        return res.status(200).json(horarios);
    } catch (error) {
        console.error("Error al obtener todos los horarios:", error);
        return res.status(500).json({ message: "Error interno del servidor", error });
    }
};
