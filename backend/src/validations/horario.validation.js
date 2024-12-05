import Joi from "joi";


export const materiaValidation = Joi.object({
  nombre: Joi.string()
    .trim() 
    .pattern(/^[a-zA-ZÀ-ÿ0-9 ]+$/) 
    .max(55)
    .required()
    .messages({
      "any.required": "El nombre de la materia es obligatorio.",
      "string.empty": "El nombre de la materia no puede estar vacío.",
      "string.pattern.base": "El nombre de la materia solo puede contener letras, números y espacios.",
      "string.max": "El nombre de la materia no puede tener más de 55 caracteres.",
      "string.trim": "El nombre de la materia no debe tener espacios al principio o al final.",
    }),
});


export const cursoValidation = Joi.object({
  nombre: Joi.string()
    .trim() 
    .pattern(/^(1ro|2do|3ro|4to) Medio [A-G]$/) 
    .required()
    .messages({
      "any.required": "El nombre del curso es obligatorio.",
      "string.empty": "El nombre del curso no puede estar vacío.",
      "string.pattern.base": "El nombre del curso debe ser de 1ro a 4to medio con secciones de A a G. Ejemplo: '1ro Medio A'.",
      "string.trim": "El nombre del curso no debe tener espacios al principio o al final.",
    }),
  aula: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .required()
    .messages({
      "any.required": "El número del aula es obligatorio.",
      "number.base": "El aula debe ser un número entero.",
      "number.integer": "El aula debe ser un número entero sin decimales.",
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
  hora_Inicio: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional()
    .messages({
      "string.pattern.base": "La hora de inicio debe estar en formato HH:mm.",
    }),
  hora_Fin: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional()
    .messages({
      "string.pattern.base": "La hora de fin debe estar en formato HH:mm.",
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
          }),
        bloque: Joi.string().required().messages({
          "any.required": "El bloque es obligatorio.",
        }),
        hora_Inicio: Joi.string()
          .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
          .optional()
          .messages({
            "string.pattern.base": "La hora de inicio debe estar en formato HH:mm.",
          }),
        hora_Fin: Joi.string()
          .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
          .optional()
          .messages({
            "string.pattern.base": "La hora de fin debe estar en formato HH:mm.",
          }),
      }).unknown(true)
    )
    .required(),
});


const BLOQUES_HORARIOS = {
  "08:00 - 08:45": { hora_Inicio: "08:00", hora_Fin: "08:45" },
  "08:50 - 09:35": { hora_Inicio: "08:50", hora_Fin: "09:35" },
  "09:40 - 10:25": { hora_Inicio: "09:40", hora_Fin: "10:25" },
  "11:20 - 12:05": { hora_Inicio: "11:20", hora_Fin: "12:05" },
  "12:10 - 12:55": { hora_Inicio: "12:10", hora_Fin: "12:55" },
  "14:30 - 15:15": { hora_Inicio: "14:30", hora_Fin: "15:15" },
  "15:20 - 16:05": { hora_Inicio: "15:20", hora_Fin: "16:05" },
  "16:10 - 16:55": { hora_Inicio: "16:10", hora_Fin: "16:55" },
  "17:00 - 17:45": { hora_Inicio: "17:00", hora_Fin: "17:45" },
};


export const validarSincronizacionBloque = (bloque, hora_Inicio, hora_Fin) => {
  const rango = BLOQUES_HORARIOS[bloque];
  if (!rango) {
    throw new Error(`El bloque "${bloque}" no es válido.`);
  }
  if (rango.hora_Inicio !== hora_Inicio || rango.hora_Fin !== hora_Fin) {
    throw new Error(
      `Las horas (${hora_Inicio} - ${hora_Fin}) no coinciden con el bloque "${bloque}" (${rango.hora_Inicio} - ${rango.hora_Fin}).`
    );
  }
};
