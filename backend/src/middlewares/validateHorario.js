"use strict";
import { horarioValidation } from "../validations/horario.validation.js";
import { AppDataSource } from "../config/configDb.js";
import Curso from "../entity/curso.entity.js";
import Materia from "../entity/materia.entity.js";

export const validateHorario = async (req, res, next) => {
  const { error } = horarioValidation.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(err => err.message) });
  }

  const { ID_materia, ID_curso } = req.body;

  try {
    const materia = await AppDataSource.getRepository(Materia).findOneBy({ id: ID_materia });
    if (!materia) {
      return res.status(400).json({ message: "La materia no existe en la base de datos." });
    }

    const curso = await AppDataSource.getRepository(Curso).findOneBy({ id: ID_curso });
    if (!curso) {
      return res.status(400).json({ message: "El curso no existe en la base de datos." });
    }
  } catch (dbError) {
    console.error("Error al validar IDs de materia y curso:", dbError);
    return res.status(500).json({ message: "Error interno del servidor" });
  }

  next();
};
