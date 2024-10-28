"use strict";
import Practica from "../entity/practica.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function crearPracticaService(practicaData) {
  try {
    const practicaRepository = AppDataSource.getRepository(Practica);
    
    const { nombre, descripcion, cupo, direccion, estado, ID_especialidad } = practicaData;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const especialidad = await AppDataSource.getRepository("Especialidad").findOne({
      where: { ID_especialidad }
    });

    if (!especialidad) {
      return [null, createErrorMessage(ID_especialidad, "El ID de especialidad no existe")];
    }

    const nuevaPractica = practicaRepository.create({
      nombre,
      descripcion,
      cupo,
      direccion,
      estado,
      ID_especialidad,
    });

    await practicaRepository.save(nuevaPractica);

    return [nuevaPractica, null];
  } catch (error) {
    console.error("Error al crear la práctica:", error);
    return [null, "Error interno del servidor"];
  }
}
