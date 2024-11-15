"use strict";
import { createAtrasoService,
         obtenerAtrasos,
         obtenerInfoAtraso
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