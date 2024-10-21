"use strict";
import Atraso from "../entity/atrasos.entity.js";  // Importa la entidad Atraso
import { AppDataSource } from "../config/configDb.js";
import moment from "moment-timezone";

export async function createAtrasoService(rut) {
  try {
    const atrasoRepository = AppDataSource.getRepository(Atraso);

    // Obtener la fecha y hora actual en la zona horaria de Santiago de Chile
    const fechaActual = moment().tz("America/Santiago").format("YYYY-MM-DD");
    const horaActual = moment().tz("America/Santiago").format("HH:mm:ss");

    // Crear el objeto de atraso
    const nuevoAtraso = atrasoRepository.create({
      RUN: rut,  // Relacionar el atraso con el RUN del usuario
      fecha: fechaActual,
      hora: horaActual,
      estado: 'activo',
    });

    // Guardar el nuevo atraso en la base de datos
    await atrasoRepository.save(nuevoAtraso);

    return [nuevoAtraso, null];
  } catch (error) {
    console.error("Error al registrar el atraso:", error);
    return [null, "Error interno del servidor"];
  }
}
