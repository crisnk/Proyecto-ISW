"use strict";
import Atraso from "../entity/atraso.entity.js";  // Importa la entidad Atraso
import Justificativo  from "../entity/justificativo.entity.js";
import { AppDataSource } from "../config/configDb.js";
import moment from "moment-timezone";

export async function createAtrasoService(rut) {
  try {
    const atrasoRepository = AppDataSource.getRepository(Atraso);

    const fechaActual = moment().tz("America/Santiago").format("YYYY-MM-DD");
    const horaActual = moment().tz("America/Santiago").format("HH:mm:ss");

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

export async function findAtraso(rut,fecha,hora){
  try{
    const atrasoRepository = AppDataSource.getRepository(Atraso);
    const atraso = await atrasoRepository.findOne({
      
      where: {
        rut: rut,
        fecha: fecha,
        hora: hora,
      },
    });
    return atraso;
  }catch (error){
    console.error('Error al buscar el atraso:', error);
    throw new Error('No se pudo buscar el atraso');

  }

}

export async function createJustificativo(justificativoData){
  try{
    const justificativoRepository = AppDataSource.getRepository(Justificativo);
    const nuevoJustificativo = justificativoRepository.create(justificativoData);
    await justificativoRepository.save(nuevoJustificativo);

    return nuevoJustificativo;

  }catch (error){
    console.error('Error al crear justificativo:', error);
    throw new Error('No se pudo crear el justificativo');
  }
}