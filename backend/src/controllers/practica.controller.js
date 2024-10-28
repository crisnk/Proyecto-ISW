"use strict";
import { crearPracticaService } from "../services/practica.service.js";
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
