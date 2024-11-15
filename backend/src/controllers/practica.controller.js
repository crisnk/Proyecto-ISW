"use strict";
import {
  crearPracticaService,
  modificarPracticaService,
  obtenerPracticasService,
  obtenerPracticaService,
  eliminarPracticaService,
  postularPracticaService,
  cancelarPostulacionService
} from "../services/practica.service.js";
import { practicaValidation } from "../validations/practica.validation.js";
import { postulaValidation } from "../validations/postula.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function crearPractica(req, res) {
  try {
    const { body } = req;

    const { error } = practicaValidation.validate(body);

    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const [nuevaPractica, errorNuevaPractica] = await crearPracticaService(body);

    if (errorNuevaPractica) {
      return handleErrorClient(res, 400, "Error creando la práctica", errorNuevaPractica);
    }

    handleSuccess(res, 201, "Práctica creada con éxito", nuevaPractica);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function modificarPractica(req, res) {
  try {
    const { ID_practica } = req.params;
    const { body } = req;

    const { error } = practicaValidation.validate(body);
    if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

    const data = { ID_practica, ...body };
    const { practicaModificada, errorPracticaModificada } = await modificarPracticaService(data);

    if (errorPracticaModificada) {
      return handleErrorClient(res, 400, "Error modificando la práctica", errorPracticaModificada);
    }

    handleSuccess(res, 200, "Práctica modificada con éxito", practicaModificada);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function obtenerPracticas(req, res) {
  try {
    const [practicas, error] = await obtenerPracticasService();

    if (error) {
      return handleErrorClient(res, 400, "Error obteniendo las prácticas", error);
    }

    const message = practicas.length === 0
      ? "No se han encontrado prácticas"
      : "Prácticas obtenidas con éxito";

    handleSuccess(res, 200, message, practicas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function obtenerPractica(req, res) {
  try {
    const { ID_practica } = req.params;
    const [practica, error] = await obtenerPracticaService(ID_practica);

    if (error) {
      return handleErrorClient(res, 404, "Error obteniendo la práctica", error);
    }

    handleSuccess(res, 200, "Práctica obtenida con éxito", practica);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function eliminarPractica(req, res) {
  try {
    const { ID_practica } = req.params;
    const [practicaEliminada, error] = await eliminarPracticaService(ID_practica);

    if (error) {
      return handleErrorClient(res, 400, "Error eliminando la práctica", error);
    }

    handleSuccess(res, 200, "Práctica eliminada con éxito", practicaEliminada);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function postularPractica(req, res) {
  try {
    const { ID_practica } = req.params;
    
    const token = req.cookies.jwt;
    if (!token) {
      return handleErrorClient(res, 401, "No se ha proporcionado un token de autenticación");
    }
    
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    
    const { rut } = decoded;
    
    const { error } = postulaValidation.validate({ ID_practica, rut });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const [nuevaPostulacion, errorNuevaPostulacion] = await postularPracticaService({ rut, ID_practica });

    if (errorNuevaPostulacion) {
      return handleErrorClient(res, 400, errorNuevaPostulacion.message || "Error creando la postulación", errorNuevaPostulacion.dataInfo);
    }

    handleSuccess(res, 201, "Postulación creada con éxito", nuevaPostulacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function cancelarPostulacion(req, res) {
  try {
    const { ID_practica } = req.params;

    const token = req.cookies.jwt;
    if (!token) {
      return handleErrorClient(res, 401, "No se ha proporcionado un token de autenticación");
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const { rut } = decoded;

    const [postulacionEliminada, errorEliminar] = await cancelarPostulacionService(ID_practica, rut);

    if (errorEliminar) {
      return handleErrorClient(res, 400, "Error al cancelar la postulación", errorEliminar);
    }

    handleSuccess(res, 200, "Postulación cancelada con éxito", postulacionEliminada);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
