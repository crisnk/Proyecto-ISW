"use strict";
import Atraso from "../entity/atraso.entity.js";  // Importa la entidad Atraso
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
      rut: rut,  // Relacionar el atraso con el RUN del usuario
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

export async function obtenerAtrasos(){
  try {
    const atrasoRepository = AppDataSource.getRepository(Atraso);

    const atrasos = await atrasoRepository.find();

    if(!atrasos || atrasos.length === 0) return [null, "No hay Atrasos"];

    const atrasosData = atrasos.map (({ fecha, hora, estado }) => ({
      fecha,
      hora,
      estado,
    }));
    
    return [atrasosData, null];
  } catch (error) {
    console.error("Error al obtener a los atrasos:", error);
    return [null, "Error interno del servidor"];
  }
}