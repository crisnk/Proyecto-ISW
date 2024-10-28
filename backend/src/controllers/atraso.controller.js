"use strict";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
import { createAtrasoService,
         findAtraso,
         createJustificativo
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

export async function generarJustificativo(req, res){
  try{
    const { motivo, fecha, hora } = req.body;
    const estado = 'pendiente';
    const token = req.cookies.jwt;

    if (!token) {
      return handleErrorClient(res, 401, "No se ha proporcionado un token de autenticación");
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const { rut } = decoded; 
    if (!rut) {
      return handleErrorClient(res, 401, "Token inválido o RUN no presente en el token");
    }   

    if (!motivo || !fecha || !hora ) {
      return handleErrorClient(res, 400, "Faltan datos necesarios");
    }
    
    const atraso = await findAtraso(rut, fecha, hora);
    
    if (!atraso) {
      return handleErrorClient(res, 404, 'Atraso no encontrado');
    }
       
      const ID_atraso = atraso.ID_atraso;
      // Crear el justificativo
      const nuevoJustificativo = await createJustificativo({
          rut,
          motivo,
          estado,
          //documento,
          ID_atraso
      });
      res.status(201).json({
        justificativo: nuevoJustificativo
      });
  }catch (error){
    console.error("Error:", error);
    res.status(500).json({ message: "Error al procesar justificativo" });
  }
}