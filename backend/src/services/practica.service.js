"use strict";
import Practica from "../entity/practica.entity.js";
import Postula from "../entity/postula.entity.js";
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
    const practicas = await practicaRepository.find({
      relations: {
        ID_especialidad: true,
      },
      select: {
        ID_practica: true,
        nombre: true,
        descripcion: true,
        cupo: true,
        direccion: true,
        estado: true,
        createdAt: true,
        updatedAt: true,
        ID_especialidad: {
          ID_especialidad: true,
          nombre: true,
        },
      },
    });

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
    const postulaRepository = AppDataSource.getRepository(Postula);
    const practicaRepository = AppDataSource.getRepository(Practica);

    const practicaEncontrada = await practicaRepository.findOne({ where: { ID_practica } });

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message,
    });

    if (!practicaEncontrada) {
      return [null, createErrorMessage(ID_practica, "No se ha encontrado una práctica con ese ID")];
    }

    const postulacionesAsociadas = await postulaRepository.find({
      where: { ID_practica },
    });

    if (postulacionesAsociadas.length > 0) {
      await postulaRepository.delete({
        ID_practica,
      });
      // await postulaRepository.update({ ID_practica }, { estado: 'inactivo' });
    }

    await practicaRepository.delete({ ID_practica });

    return [practicaEncontrada, null];
  } catch (error) {
    console.error("Error al eliminar la práctica:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function postularPracticaService(data) {
  try {
    const postulaRepository = AppDataSource.getRepository(Postula);
    const { rut, ID_practica } = data;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const usuario = await AppDataSource.getRepository("User").findOne({
      where: { rut }
    });

    if (!usuario) {
      return [null, createErrorMessage(rut, "El RUT del usuario no existe")];
    }

    const practica = await AppDataSource.getRepository("Practica").findOne({
      where: { ID_practica }
    });

    if (!practica) {
      return [null, createErrorMessage(ID_practica, "El ID de práctica no existe")];
    }

    const postulacionExistente = await postulaRepository.findOne({
      where: { rut, ID_practica }
    });

    if (postulacionExistente) {
      return [null, createErrorMessage(postulacionExistente, "Ya has postulado a esta práctica")];
    }

    if (practica.cupo <= 0) {
      return [null, createErrorMessage(ID_practica, "No quedan cupos disponibles para esta práctica")];
    }

    const nuevaPostulacion = postulaRepository.create({
      rut,
      ID_practica,
      estado: "Pendiente"
    });

    await postulaRepository.save(nuevaPostulacion);

    return [nuevaPostulacion, null];
  } catch (error) {
    console.error("Error al postular a la práctica:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function cancelarPostulacionService(ID_postulacion, rut) {
  try {
    const postulaRepository = AppDataSource.getRepository(Postula);
    const practicaRepository = AppDataSource.getRepository(Practica);

    const postulacionEncontrada = await postulaRepository.findOne({
      where: { ID_postulacion, rut },
    });

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    if (!postulacionEncontrada) {
      return [null, createErrorMessage(ID_postulacion, "No se ha encontrado la postulación para cancelar")];
    }

    if (postulacionEncontrada.estado === 'Aceptado') {
      return [null, createErrorMessage(null, "No puedes cancelar una postulación en la que has sido aceptado")];
    }

    const practica = await practicaRepository.findOne({
      where: { ID_practica: postulacionEncontrada.ID_practica },
    });

    if (!practica) {
      return [null, createErrorMessage(postulacionEncontrada.ID_practica, "No se ha encontrado la práctica asociada")];
    }

    await postulaRepository.delete({ ID_postulacion });

    return [postulacionEncontrada, null];
  } catch (error) {
    console.error("Error al cancelar la postulación:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function obtenerPostulacionesService(rut, rol) {
  try {
    const postulaRepository = AppDataSource.getRepository(Postula);

    const whereCondition = rol === 'EDP' ? {} : { rut }

    const postulaciones = await postulaRepository.find({
      where: whereCondition,
      relations: {
        ID_practica: {
          ID_especialidad: true,
        },
        rut: true,
      },
      select: {
        ID_postulacion: true,
        estado: true,
        createdAt: true,
        ID_practica: {
          ID_practica: true,
          nombre: true,
          descripcion: true,
          cupo: true,
          createdAt: true,
          direccion: true,
          ID_especialidad: {
            nombre: true,
          }
        },
        rut: {
          nombreCompleto: true,
          rut: true,
        },
      },
    });

    return [postulaciones, null];
  } catch (error) {
    console.error("Error al obtener las postulaciones del alumno:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updatePostulacionService(data) {
  const { ID_postulacion, rut, estado } = data;

  const postulaRepository = AppDataSource.getRepository(Postula);
  const practicaRepository = AppDataSource.getRepository(Practica);

  // ----------------------------- Búsqueda de postulación -----------------------------
  const postulacionEncontrada = await postulaRepository.findOne({
    where: { ID_postulacion, rut },
    relations: ['ID_practica']
  });

  const createErrorMessage = (dataInfo, message) => ({
    dataInfo,
    message
  });

  if (!postulacionEncontrada)
    return [null, createErrorMessage(null, "No se ha encontrado una postulación asociada a ese RUT")];
  // ----------------------------- Fin búsqueda de postulación -----------------------------

  // ----------------------------- Búsqueda de práctica -----------------------------
  const practica = await practicaRepository.findOne({
    where: { ID_practica: postulacionEncontrada.ID_practica.ID_practica }
  });
  if (!practica) return [null, createErrorMessage(postulacionEncontrada.ID_practica, "La práctica asociada no existe")];
  // ----------------------------- Fin búsqueda de práctica -----------------------------

  // ----------------------------- Validaciones -----------------------------
  if (estado === postulacionEncontrada.estado) {
    const message = estado.toLowerCase();
    return [null, createErrorMessage(null, `Ya has ${message} esta postulación`)];
  }

  if (estado === "Aceptado") {
    // Rechaza todas las postulaciones para después aceptar la postulación entrante
    await postulaRepository.update(
      { rut },
      { estado: "Rechazado", updatedAt: new Date() }
    );

    if (practica.cupo > 0) {
      practica.cupo -= 1;
      await practicaRepository.save(practica);
    } else {
      return [null, createErrorMessage(postulacionEncontrada.ID_practica, "No hay cupos disponibles para esta práctica.")];
    }
  }

  // Por si se equivocó al aceptarlo y lo rechaza se recupera el cupo
  if (estado === "Rechazado" && postulacionEncontrada.estado === "Aceptado") { 
    practica.cupo += 1;
    await practicaRepository.save(practica);
  }
  // ----------------------------- Fin validaciones -----------------------------

  postulacionEncontrada.estado = estado;

  await postulaRepository.update(
    { ID_postulacion, rut },
    { estado: postulacionEncontrada.estado, updatedAt: new Date() }
  );

  const postulacionActualizada = await postulaRepository.findOne({
    where: { ID_postulacion, rut },
    relations: ['ID_practica']
  });

  if (!postulacionActualizada) {
    return [null, createErrorMessage(ID_postulacion, "No se pudo obtener la postulación actualizada")];
  }

  return [postulacionActualizada, null];
}