"use strict";
import { crearPracticaService, modificarPracticaService } from "../services/practica.service.js";
import { practicaValidation } from "../validations/practica.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess} from "../handlers/responseHandlers.js";

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