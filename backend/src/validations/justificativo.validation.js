"use strict";
import Joi from "joi";

export const justificativoValidation = Joi.object({
    motivo: Joi.string()
      .min(10)
      .max(200)
      .required()
      .messages({
        "string.empty": "El motivo no puede estar vacío.",
        "any.required": "El motivo es obligatorio.",
        "string.min": "El motivo debe tener al menos 10 caracteres.",
        "string.max": "El motivo debe tener como máximo 200 caracteres.",
      }),
    documento: Joi.string()
      .pattern(/\.(pdf|png)$/)
      .messages({
        "string.pattern.base": "El documento debe ser un archivo válido (.png o .pdf).",
      }),
    ID_atraso: Joi.number()
      .integer()
      .required()
      .messages({
        "any.required": "El ID del atraso es obligatorio.",
        "number.base": "El ID del atraso debe ser un número.",
        "number.integer": "El ID del atraso debe ser un número entero.",
      }),
  });
  