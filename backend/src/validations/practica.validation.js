"use strict";
import Joi from "joi";

export const practicaValidation = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "any.required": "El nombre es obligatorio.",
      "string.base": "El nombre debe ser de tipo texto.",
      "string.min": "El nombre debe tener al menos 3 caracteres.",
      "string.max": "El nombre debe tener como máximo 255 caracteres.",
    }),
  descripcion: Joi.string()
    .min(10)
    .max(255)
    .required()
    .messages({
      "string.empty": "La descripción no puede estar vacía.",
      "any.required": "La descripción es obligatoria.",
      "string.base": "La descripción debe ser de tipo texto.",
      "string.min": "La descripción debe tener al menos 10 caracteres.",
      "string.max": "La descripción debe tener como máximo 255 caracteres.",
    }),
  cupo: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "El cupo debe ser un número.",
      "number.integer": "El cupo debe ser un número entero.",
      "number.min": "El cupo debe ser al menos 1.",
      "any.required": "El cupo es obligatorio.",
    }),
  direccion: Joi.string()
    .min(5)
    .max(255)
    .required()
    .messages({
      "string.empty": "La dirección no puede estar vacía.",
      "any.required": "La dirección es obligatoria.",
      "string.base": "La dirección debe ser de tipo texto.",
      "string.min": "La dirección debe tener al menos 5 caracteres.",
      "string.max": "La dirección debe tener como máximo 255 caracteres.",
    }),
  estado: Joi.string()
    .valid('activo', 'inactivo')
    .required()
    .messages({
      "any.only": "El estado debe ser 'activa' o 'inactiva'.",
      "string.empty": "El estado no puede estar vacío.",
      "any.required": "El estado es obligatorio.",
      "string.base": "El estado debe ser de tipo texto.",
    }),
  ID_especialidad: Joi.number()
    .integer()
    .required()
    .messages({
      "number.base": "El ID de especialidad debe ser un número.",
      "number.integer": "El ID de especialidad debe ser un número entero.",
      "any.required": "El ID de especialidad es obligatorio.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});
