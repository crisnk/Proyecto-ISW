"use strict";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
import { createAtrasoService } from "../services/atraso.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function registrarAtraso(req, res) {
  try {
    // Obtener el token JWT de la cookie
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

    // Llamar al servicio para registrar el atraso, pasando el RUN
    const [atrasoCreado, error] = await createAtrasoService(rut);

    if (error) {
      return handleErrorClient(res, 400, "Error al registrar el atraso", error);
    }

    // Enviar una respuesta exitosa con los detalles del atraso creado
    handleSuccess(res, 201, "Atraso registrado con éxito", atrasoCreado);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return handleErrorClient(res, 401, "Token inválido o expirado");
    }

    handleErrorServer(res, 500, error.message);
  }
}