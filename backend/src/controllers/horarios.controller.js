"use strict";
import { AppDataSource } from "../config/configDb.js";
import Imparte from "../entity/imparte.entity.js";
import Pertenece from "../entity/pertenece.entity.js";
import { horarioValidation } from "../validations/horario.validation.js";
import { asignaHorarioService, modificaHorarioService } from "../services/horario.service.js";


export const asignaHorario = async (req, res) => {
    const { rol } = req.user;
   
    if (rol !== "jefeUTP") {
        return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
    }
    
    const { error } = horarioValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { ID_materia, ID_curso, rut, dia, hora_Inicio, hora_Fin } = req.body;

    try {
        
        const horarioExistente = await AppDataSource.getRepository(Imparte).findOne({
            where: { ID_curso, dia, hora_Inicio }
        });

        if (horarioExistente) {
            return res.status(400).json({
                message: `Ya existe una asignación en ${dia} a las ${hora_Inicio} para el curso: ${ID_curso}.`
            });
        }
       
        const horarioAsignado = await asignaHorarioService(req.body);

        res.status(201).json({ message: "Horario creado correctamente", horario: horarioAsignado });
    } catch (error) {
        console.error("Error al asignar horario:", error);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
};


export const modificaHorario = async (req, res) => {
    const { rol } = req.user;
    
    if (rol !== "jefeUTP") {
        return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
    } 
    const { error } = horarioValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {  
        const horarioModificado = await modificaHorarioService(req.params.id, req.body);
        res.status(200).json({ message: "Horario modificado correctamente", horario: horarioModificado });
    } catch (error) {
        console.error("Error al modificar horario:", error);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
};

export const verHorario = async (req, res) => {
    const { rol, rut } = req.user;

    try {
        let horarios;
        
        if (rol === "jefeUTP") {
            horarios = await AppDataSource.getRepository(Imparte).find();
        }    
        else if (rol === "profesor") {
            horarios = await AppDataSource.getRepository(Imparte).find({ where: { rut } });
        } 
        else if (rol === "alumno") {
            const cursoAlumno = await AppDataSource.getRepository(Pertenece).findOne({ where: { rut } });
            if (!cursoAlumno) return res.status(404).json({ message: "Curso no encontrado para el alumno" });

            horarios = await AppDataSource.getRepository(Imparte).find({ where: { ID_curso: cursoAlumno.ID_curso } });
        }  
        res.status(200).json({ horarios });
    } catch (error) {
        console.error("Error al ver horario:", error);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
};