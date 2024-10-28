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
    .min(9)
    .max(12)
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.empty": "El rut no puede estar vacío.",
      "string.base": "El rut debe ser de tipo string.",
      "string.min": "El rut debe tener como mínimo 9 caracteres.",
      "string.max": "El rut debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
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