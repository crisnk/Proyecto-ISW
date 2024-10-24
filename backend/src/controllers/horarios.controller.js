"use strict";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import {
    assignHorarioService, 
    createHorarioService, 
    getAlumnoHorarioService,
    getProfesorHorarioService,
    
} from "../services/horarios.service.js";
 async function createHorario(req, res) {
    try {
        const { dia, hora_inicio, hora_fin,
            id_materia, id_curso } = req.body;

        if (req.user.rol !== "jefeUTP") {
            return handleErrorClient(res, 403, "Solo el jefe de UTP puede crear horarios");

        } 
        const [horario, error] = await createHorarioService({
            dia, hora_inicio, hora_fin, id_materia, id_curso   
        });
        if (error) return handleErrorClient( res, 400, "Error al crear horario", error);
        handleSuccess(res, 201, "Horario creado correctamente", horario);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
async function assignHorario(req, res) {
    try {
        const { id_horario, id_profesor } = req.body;
        //verifica que el usuario sea jefeUTP
        if (req.user.rol !== "jefeUTP") {
            return handleErrorClient(res, 403, "Solo el jefe de UTP puede asignar horarios");
        }
        const [asignacion, error] = await assignHorarioService({ id_horario, id_profesor });
        if (error) return handleErrorClient(res, 400, "Error al asignar horario", error);
        handleSuccess(res, 200, "Horario asignado correctamente", asignacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);

    }
}
async function getProfesorHorario(req, res) {
    try {
      const profesorId = req.user.id;
  
      const [horarios, error] = await getProfesorHorarioService(profesorId);
  
      if (error) return handleErrorClient(res, 404, "Error al obtener los horarios", error);
  
      handleSuccess(res, 200, "Horarios del profesor obtenidos correctamente", horarios);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }
  
async function getAlumnoHorario(req, res) {
    try {
      const alumnoId = req.user.id;
  
      const [horarios, error] = await getAlumnoHorarioService(alumnoId);
  
      if (error) return handleErrorClient(res, 404, "Error al obtener los horarios", error);
  
      handleSuccess(res, 200, "Horarios del alumno obtenidos correctamente", horarios);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }  

  export { createHorario, getAlumnoHorario, getProfesorHorario, assignHorario };    