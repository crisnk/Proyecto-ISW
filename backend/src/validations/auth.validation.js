"use strict";
import Joi from "joi";

const domainEmailValidator = (value, helper) => {
  const validDomains = ["@gmail.cl", "@alumnos.ubiobio.cl", "@gmail.com"];
  const isValid = validDomains.some((domain) => value.endsWith(domain));

  if (!isValid) {
    return helper.message(
      "El correo electrónico debe finalizar en @gmail.cl, @alumnos.ubiobio.cl o @gmail.com."
    );
  }
  return value;
};

export const authValidation = Joi.object({
  email: Joi.string()
    .min(15)
    .max(50)
    .email()
    .required()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "any.required": "El correo electrónico es obligatorio.",
      "string.base": "El correo electrónico debe ser de tipo texto.",
      "string.email": "El correo electrónico debe finalizar en un dominio válido.",
      "string.min": "El correo electrónico debe tener al menos 15 caracteres.",
      "string.max": "El correo electrónico debe tener como máximo 35 caracteres.",
    })
    .custom(domainEmailValidator, "Validación dominio email"),
  password: Joi.string()
    .min(8)
    .max(26)
    .pattern(/^[a-zA-Z0-9]+$/)
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "any.required": "La contraseña es obligatoria.",
      "string.base": "La contraseña debe ser de tipo texto.",
      "string.min": "La contraseña debe tener al menos 8 caracteres.",
      "string.max": "La contraseña debe tener como máximo 26 caracteres.",
      "string.pattern.base": "La contraseña solo puede contener letras y números.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});
export const registerValidation = Joi.object({
  nombreCompleto: Joi.string()
    .min(15)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      "string.empty": "El nombre completo no puede estar vacío.",
      "any.required": "El nombre completo es obligatorio.",
      "string.min": "El nombre completo debe tener al menos 15 caracteres.",
      "string.max": "El nombre completo debe tener como máximo 50 caracteres.",
      "string.pattern.base": "El nombre completo solo puede contener letras y espacios.",
    }),
  rut: Joi.string()
    .min(9)
    .max(12)
    .required()
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.empty": "El rut no puede estar vacío.",
      "string.min": "El rut debe tener como mínimo 9 caracteres.",
      "string.max": "El rut debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),
  email: Joi.string()
    .min(15)
    .max(50)
    .email()
    .required()
    .custom(domainEmailValidator, "Validación dominio email")
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "any.required": "El correo electrónico es obligatorio.",
      "string.min": "El correo electrónico debe tener al menos 15 caracteres.",
      "string.max": "El correo electrónico debe tener como máximo 50 caracteres.",
    }),
  password: Joi.string()
    .min(8)
    .max(26)
    .pattern(/^[a-zA-Z0-9]+$/)
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "any.required": "La contraseña es obligatoria.",
      "string.min": "La contraseña debe tener al menos 8 caracteres.",
      "string.max": "La contraseña debe tener como máximo 26 caracteres.",
      "string.pattern.base": "La contraseña solo puede contener letras y números.",
    }),
  rol: Joi.string()
    .valid("alumno", "profesor", "jefeUTP", "administrador")
    .required()
    .messages({
      "string.empty": "El rol no puede estar vacío.",
      "any.required": "El rol es obligatorio.",
      "any.only": "El rol debe ser uno de los siguientes: alumno, profesor, jefeUTP, administrador.",
    }),
  curso: Joi.when("rol", {
    is: "alumno",
    then: Joi.number().integer().required().messages({
      "any.required": "Debe seleccionar un curso para el alumno.",
      "number.base": "El curso debe ser un número.",
      "number.integer": "El curso debe ser un número entero.",
    }),
    otherwise: Joi.forbidden(),
  }),
}).unknown(false);
