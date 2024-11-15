"use strict";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
import { createAtrasoService,
         obtenerAtrasos,
         obtenerAtrasosAlumnos,
      } from "../services/atraso.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";


export async function registrarAtraso(req, res) {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return handleErrorClient(res, 401, "No se ha proporcionado un token de autenticación");
    }

    // Decodificar el token JWT para obtener el RUN
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const { rut } = decoded; // Obtener el RUN desde el token

    if (!rut) {
      return handleErrorClient(res, 401, "Token inválido o RUN no presente en el token");
    }

    const [atrasoCreado, error] = await createAtrasoService(rut);

    if (error) {
      return handleErrorClient(res, 400, "Error al registrar el atraso", error);
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
    const token = req.cookies.jwt;

    if (!token) {
      return handleErrorClient(res, 401, "No se ha proporcionado un token de autenticación");
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const { rut } = decoded;
    if (!rut) {
      return handleErrorClient(res, 401, "Token inválido o RUN no presente en el token");
    }   
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
    const token = req.cookies.jwt;

    if (!token) {
      return handleErrorClient(res, 401, "No se ha proporcionado un token de autenticación");
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const { rut } = decoded;

    if (!rut) {
      return res.status(401).json({ error: "Token inválido o RUT no presente en el token" });
    }

    const infoAtraso = await obtenerInfoAtraso(rut);

    if (infoAtraso) {
      return res.status(200).json(infoAtraso);
    } else {
      return res.status(404).json({ error: "No se encontró una coincidencia para el horario actual." });
    }

  } catch (error) {
    console.error('Error al obtener la información de atraso:', error);
    return res.status(500).json({ error: "No se pudo buscar el atraso" });
  }
}