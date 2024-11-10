"use strict";
import Joi from "joi";

export const materiaValidation = Joi.object({
  nombre: Joi.string()
    .max(55)
    .required()
    .messages({
      "any.required": "El nombre de la materia es obligatorio.",
      "string.empty": "El nombre de la materia no puede estar vacío.",
      "string.max": "El nombre de la materia no puede tener más de 55 caracteres.",
      "string.base": "El nombre de la materia debe ser un texto."
    })
});

export const cursoValidation = Joi.object({
  nombre: Joi.string()
    .pattern(/^(1ro|2do|3ro|4to) medio [A-D]$/)
    .required()
    .messages({
      "any.required": "El nombre del curso es obligatorio.",
      "string.empty": "El nombre del curso no puede estar vacío.",
      "string.pattern.base": 
      "El nombre del curso debe ser de 1ro a 4to medio con secciones de A a D. Ejemplo: '1ro medio A'.",
      "string.base": "El nombre del curso debe ser un texto."
    }),
  aula: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .required()
    .messages({
      "any.required": "El número del aula es obligatorio.",
      "number.base": "El aula debe ser un número.",
      "number.empty": "El número del aula no puede estar vacío.",
      "number.min": "El número del aula debe ser al menos 1.",
      "number.max": "El número del aula no puede ser mayor a 100."
    })
});

export const horarioValidation = Joi.object({
  ID_materia: Joi.number().integer().required().messages({
    "any.required": "La materia es obligatoria.",
    "number.base": "La materia debe ser un número entero.",
    "number.empty": "La materia no puede estar vacía.",
  }),
  ID_curso: Joi.number().integer().required().messages({
    "any.required": "El curso es obligatorio.",
    "number.base": "El curso debe ser un número entero.",
    "number.empty": "El curso no puede estar vacío.",
  }),
  rut: Joi.string()
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .required()
    .messages({
      "any.required": "El RUT es obligatorio.",
      "string.empty": "El RUT no puede estar vacío.",
      "string.pattern.base": "Formato RUT inválido. Debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),
  dia: Joi.string()
    .valid("lunes", "martes", "miércoles", "jueves", "viernes")
    .required()
    .messages({
      "any.required": "El día es obligatorio.",
      "any.only": "El día debe ser válido (lunes a viernes).",
    }),
  bloque: Joi.string()
    .valid(
      "08:00 - 08:45",
      "08:50 - 09:35",
      "09:40 - 10:25",
      "10:30 - 11:15",  // Recreo
      "11:20 - 12:05",
      "12:10 - 12:55",
      "13:00 - 13:45",  // Recreo
      "14:30 - 15:15",
      "15:20 - 16:05",
      "16:10 - 16:55",
      "17:00 - 17:45"
    )
    .required()
    .messages({
      "any.required": "El bloque horario es obligatorio.",
      "any.only": "El bloque debe ser uno de los horarios disponibles.",
    }),
});

export const paginationAndFilterValidation = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    "number.base": "La página debe ser un número.",
    "number.min": "La página debe ser al menos 1.",
  }),
  limit: Joi.number().integer().min(1).optional().messages({
    "number.base": "El límite debe ser un número.",
    "number.min": "El límite debe ser al menos 1.",
  }),
  curso: Joi.string().allow("").optional().messages({
    "string.base": "El curso debe ser un string.",
  }),
  profesor: Joi.string().allow("").optional().messages({
    "string.base": "El profesor debe ser un string.",
  }),
});

export const validarHorario = (dia, bloque) => {
  const recreoHoras = ["10:30 - 11:15", "13:00 - 13:45"];

  if (recreoHoras.includes(bloque)) {
    throw new Error(`No se puede asignar una materia en el bloque de recreo (${dia}, ${bloque}).`);
  }
};