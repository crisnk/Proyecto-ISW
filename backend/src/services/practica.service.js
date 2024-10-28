"use strict";
import Practica from "../entity/practica.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function crearPracticaService(data) {
  try {
    const practicaRepository = AppDataSource.getRepository(Practica);
    
    const { nombre, descripcion, cupo, direccion, estado, ID_especialidad } = data;

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

export async function modificarPracticaService(data) {
  try {
    const { nombre, descripcion, cupo, direccion, estado, ID_especialidad, ID_practica } = data;
    
    const practicaRepository = AppDataSource.getRepository(Practica);

    const practicaEncontrada = await practicaRepository.findOne({ where: { ID_practica } });

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    if (!practicaEncontrada) return [null, createErrorMessage(ID_practica, "El ID de practica no existe")];

    await practicaRepository.update(ID_practica, {
      nombre,
      descripcion,
      cupo,
      direccion,
      estado,
      ID_especialidad,
      updatedAt: new Date(),
    });

    const practicaActualizada = await practicaRepository.findOne({ where: { ID_practica } });
    return [practicaActualizada, null];
  } catch (error) {
    console.error("Error al modificar la práctica:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function obtenerPracticasService() {
  try {
    const practicaRepository = AppDataSource.getRepository(Practica);
    const practicas = await practicaRepository.find();

    return [practicas, null];
  } catch (error) {
    console.error("Error al obtener las prácticas:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function obtenerPracticaService(ID_practica) {
  try {
    const practicaRepository = AppDataSource.getRepository(Practica);

    const practica = await practicaRepository.findOne({ where: { ID_practica } });

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message,
    });

    if (!practica) {
      return [null, createErrorMessage(ID_practica, `No se ha encontrado una práctica con ID: ${ID_practica}`)];
    }

    return [practica, null];
  } catch (error) {
    console.error("Error al obtener las prácticas:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function eliminarPracticaService(ID_practica) {
  try {
    const practicaRepository = AppDataSource.getRepository(Practica);

    const practicaEncontrada = await practicaRepository.findOne({ where: { ID_practica } });

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message,
    });

    if (!practicaEncontrada) {
      return [null, createErrorMessage(ID_practica, "No se ha encontrado una práctica con ese ID")];
    }

    await practicaRepository.delete(ID_practica);
    return [practicaEncontrada, null];
  } catch (error) {
    console.error("Error al eliminar la práctica:", error);
    return [null, "Error interno del servidor"];
  }
}