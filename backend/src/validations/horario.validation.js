"use strict";
import Joi from "joi";
export const horarioValidation = Joi.object({
    ID_materia: Joi.number().integer().required().messages({
      "any.required": "La materia es obligatoria.",
      "number.base": "La materia debe ser un número.",
    }),
    ID_curso: Joi.number().integer().required().messages({
      "any.required": "El curso es obligatorio.",
      "number.base": "El curso debe ser un número.",
    }),
    rut: Joi.string()
      .pattern(/^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/)
      .required()
      .messages({
        "any.required": "El rut es obligatorio.",
        "string.pattern.base": "Formato de rut inválido.",
      }),
    dia: Joi.string().valid("lunes", "martes", "miércoles", "jueves", "viernes").required().messages({
      "any.required": "El día es obligatorio.",
      "any.only": "El día debe ser un valor válido (lunes a viernes).",
    }),
    hora_Inicio: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).required().messages({
      "any.required": "La hora de inicio es obligatoria.",
      "string.pattern.base": "La hora de inicio debe estar en formato HH:mm.",
    }),
    hora_Fin: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).required().messages({
      "any.required": "La hora de fin es obligatoria.",
      "string.pattern.base": "La hora de fin debe estar en formato HH:mm.",
    }),
  });