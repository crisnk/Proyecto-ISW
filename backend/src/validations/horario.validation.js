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
    .min(9)
    .max(12)
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .required()
    .messages({
      "any.required": "El RUT es obligatorio.",
      "string.empty": "El RUT no puede estar vacío.",
      "string.base": "El RUT debe ser de tipo string.",
      "string.min": "El RUT debe tener como mínimo 9 caracteres.",
      "string.max": "El RUT debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato RUT inválido. Debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),
  dia: Joi.string()
    .valid("lunes", "martes", "miércoles", "jueves", "viernes")
    .required()
    .messages({
      "any.required": "El día es obligatorio.",
      "any.only": "El día debe ser un valor válido (lunes a viernes).",
      "string.empty": "El día no puede estar vacío.",
    }),
  hora_Inicio: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
    .required()
    .custom((value, helpers) => {
      const [hour] = value.split(":").map(Number);
      if (hour < 8 || hour > 18) {
        return helpers.message("La hora de inicio debe estar entre las 08:00 y las 18:00.");
      }
      return value;
    })
    .messages({
      "any.required": "La hora de inicio es obligatoria.",
      "string.pattern.base": "La hora de inicio debe estar en formato HH:mm.",
      "string.empty": "La hora de inicio no puede estar vacía.",
    }),
  hora_Fin: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
    .required()
    .custom((value, helpers) => {
      const [hour] = value.split(":").map(Number);
      if (hour < 9 || hour > 20) {
        return helpers.message("La hora de fin debe estar entre las 09:00 y las 20:00.");
      }
      return value;
    })
    .messages({
      "any.required": "La hora de fin es obligatoria.",
      "string.pattern.base": "La hora de fin debe estar en formato HH:mm.",
      "string.empty": "La hora de fin no puede estar vacía.",
    }),
}).custom((values, helpers) => {
  const [horaInicioHoras, horaInicioMinutos] = values.hora_Inicio.split(":").map(Number);
  const [horaFinHoras, horaFinMinutos] = values.hora_Fin.split(":").map(Number);
  
  if (horaFinHoras < horaInicioHoras || (horaFinHoras === horaInicioHoras && horaFinMinutos <= horaInicioMinutos)) {
    return helpers.message("La hora de fin debe ser mayor que la hora de inicio.");
  }
  return values;
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

