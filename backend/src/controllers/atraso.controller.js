"use strict";
import { createAtrasoService,
         obtenerAtrasos,
         obtenerAtrasosAlumnos,
         obtenerInfoAtraso,
         findAtrasosJustificables,

      } from "../services/atraso.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { extraerRut } from "../helpers/rut.helper.js";
import { getUserSocketId } from '../services/socket.service.js';


export async function registrarAtraso(req, res) {
  try {
    const rut = await extraerRut(req);

    const response = await createAtrasoService(rut);
    console.log('response:', response.profesor.rut);
    const rutProfesor = response.profesor.rut;
    if(res.status(201)) {
    
      const io = req.app.get('socketio'); 

      // Verificamos si el profesor está conectado
      const socketId = getUserSocketId(rutProfesor);

      console.log('socketIdProfesor:', socketId);
        if (socketId) {
          io.to(socketId).emit('marca-atraso', {
            mensaje: `El estudiante ${rutProfesor} ha registrado un atraso`,
          });
          console.log(`Notificación enviada al profesor con RUT: ${rutProfesor} (Socket ID: ${socketId})`);
        } else {
          console.log(`El profesor con RUT ${rutProfesor} no está conectado.`);
        }

      handleSuccess(res, 201, "Atraso registrado con éxito", response);

    }
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return handleErrorClient(res, 401, "Token inválido o expirado");
    }
    handleErrorServer(res, 500, error.message);
  }
}

export async function verAtrasos(req,res) {
  try {
    const rut = await extraerRut(req);

    const [atrasos, errorAtrasos] = await obtenerAtrasos(rut);


    if (errorAtrasos) return handleErrorClient(res, 404, errorAtrasos);
    
    atrasos.length === 0
    ? handleSuccess(res, 204)
    : handleSuccess(res, 200, "Atrasos encontrados", atrasos);
  } catch (error) {
    handleErrorServer(res,500,error.message);
  }
};

export async function tablaAtrasosAlumnos(req,res){
  try {
    const rut = await extraerRut(req);
    const [atrasos, errorAtrasos] = await obtenerAtrasosAlumnos(rut);
    if (errorAtrasos) {
      return handleErrorClient(res, 404, errorAtrasos);
    }
    
    if (atrasos.length === 0) {
      return handleSuccess(res, 204); 
    } else {
      return handleSuccess(res, 200, "Atrasos encontrados", atrasos);
    }
  } catch (error) {
    handleErrorServer(res,500,error.message);
  }
}

export async function infoAtraso(req, res) {
  try {

    const rut = await extraerRut(req);
    const infoAtraso = await obtenerInfoAtraso(rut);

    if (!infoAtraso) {
      return handleErrorClient(res, 404, error); 
    }

    handleSuccess(res, 200, "Información de atraso encontrada", infoAtraso);

  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function infoAtrasosJustificables(req, res) {
  try {

    const rut = await extraerRut(req);
    const infoAtrasos = await findAtrasosJustificables(rut);

    if (!infoAtrasos) {
      return handleErrorClient(res, 404, error); 
    }

    handleSuccess(res, 200, "Información de atrasos encontrada", infoAtrasos);

  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}