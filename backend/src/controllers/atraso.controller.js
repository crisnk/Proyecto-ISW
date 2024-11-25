"use strict";
import { createAtrasoService,
         obtenerAtrasos,
         obtenerAtrasosAlumnos,
         obtenerAtrasosAlumnos,
      } from "../services/atraso.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { extraerRut } from "../helpers/rut.helper.js";


export async function registrarAtraso(req, res) {
  try {
    const rut = await extraerRut(req);

    const [atrasoCreado, error] = await createAtrasoService(rut);
    if (error) {
      return handleErrorServer(res, 400, "Error al registrar el atraso", error);
    }

    handleSuccess(res, 201, "Atraso registrado con éxito", atrasoCreado);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return handleErrorClient(res, 401, "Token inválido o expirado");
    }
    handleErrorServer(res, 500, error.message);
  }
}

export async function verAtrasos(req,res) {
  try {
    rut = await obtener
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
    const token = req.cookies.jwt;
    if (!token) {
      return handleErrorClient(res, 401, "No se ha proporcionado un token de autenticación");
    }
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const { rut } = decoded;
    if (!rut) {
      return handleErrorClient(res, 401, "Token inválido o RUN no presente en el token");
    }   
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
      return handleErrorClient(res, 404, "No se encontró una coincidencia para el horario actual");
    }

    handleSuccess(res, 200, "Información de atraso encontrada", infoAtraso);

  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}