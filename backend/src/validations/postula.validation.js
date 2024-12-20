"use strict";
import Joi from "joi";

export const postulaValidation = Joi.object({
  rut: Joi.string()
    .min(9)
    .max(12)
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.empty": "El RUT no puede estar vacío.",
      "string.base": "El RUT debe ser de tipo texto.",
      "string.min": "El RUT debe tener como mínimo 9 caracteres.",
      "string.max": "El RUT debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato de RUT inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),
  ID_postulacion: Joi.number()
    .integer()
    .messages({
      "number.base": "El ID de postulación debe ser un número.",
      "number.integer": "El ID de postulación debe ser un número entero.",
      "any.required": "El ID de postulación es obligatorio.",
    }),
  ID_practica: Joi.number()
    .integer()
    .messages({
      "number.base": "El ID de práctica debe ser un número.",
      "number.integer": "El ID de práctica debe ser un número entero.",
      "any.required": "El ID de práctica es obligatorio.",
    }),
  estado: Joi.string()
    .valid("Pendiente", "Aceptado", "Rechazado")
    .messages({
      "string.base": "El estado debe ser de tipo texto.",
      "any.required": "El estado es obligatorio.",
      "string.valid": "El estado debe ser uno de los siguientes valores: Pendiente, Aceptada, Rechazada.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});
