import Joi from "joi";

export const materiaValidation = Joi.object({
  nombre: Joi.string()
    .max(55)
    .required()
    .messages({
      "any.required": "El nombre de la materia es obligatorio.",
      "string.empty": "El nombre de la materia no puede estar vacío.",
      "string.max": "El nombre de la materia no puede tener más de 55 caracteres.",
      "string.base": "El nombre de la materia debe ser un texto.",
    }),
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
      "string.base": "El nombre del curso debe ser un texto.",
    }),
  aula: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .required()
    .messages({
      "any.required": "El número del aula es obligatorio.",
      "number.base": "El aula debe ser un número.",
      "number.min": "El número del aula debe ser al menos 1.",
      "number.max": "El número del aula no puede ser mayor a 100.",
    }),
});

export const horarioValidationCurso = Joi.object({
  ID_materia: Joi.number().integer().required().messages({
    "any.required": "El ID_materia es obligatorio.",
  }),
  dia: Joi.string()
    .valid("lunes", "martes", "miércoles", "jueves", "viernes")
    .required()
    .messages({
      "any.required": "El día es obligatorio.",
      "any.only": "El día debe ser uno de los siguientes: lunes, martes, miércoles, jueves, viernes.",
    }),
  bloque: Joi.string().required().messages({
    "any.required": "El bloque es obligatorio.",
  }),
});

export const horarioValidationProfesor = Joi.object({
  rut: Joi.string()
    .regex(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/)
    .required()
    .messages({
      "any.required": "El RUT del profesor es obligatorio.",
      "string.pattern.base": "El RUT debe tener un formato válido (ej: 12.345.678-9).",
    }),
  horario: Joi.array()
    .items(
      Joi.object({
        ID_materia: Joi.number().integer().required().messages({
          "any.required": "El ID_materia es obligatorio.",
        }),
        ID_curso: Joi.number().integer().required().messages({
          "any.required": "El ID_curso es obligatorio.",
        }),
        dia: Joi.string()
          .valid("lunes", "martes", "miércoles", "jueves", "viernes")
          .required()
          .messages({
            "any.required": "El día es obligatorio.",
            "any.only": "El día debe ser uno de los siguientes: lunes, martes, miércoles, jueves, viernes.",
          }),
        bloque: Joi.string().required().messages({
          "any.required": "El bloque es obligatorio.",
        }),
      }).unknown(true)
    )
    .required()
    .messages({
      "array.base": "El horario debe ser un arreglo.",
      "any.required": "El horario es obligatorio.",
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
    "string.base": "El curso debe ser un texto.",
  }),
  profesor: Joi.string().allow("").optional().messages({
    "string.base": "El profesor debe ser un texto.",
  }),
});

export const validarHorario = (dia, bloque) => {
  const recreoHoras = ["10:30 - 11:15", "13:00 - 13:45"];
  if (recreoHoras.includes(bloque)) {
    throw new Error(`No se puede asignar una materia en el bloque de recreo (${dia}, ${bloque}).`);
  }
};
