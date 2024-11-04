"use strict";
import Atraso from "../entity/atraso.entity.js";  
import Justificativo  from "../entity/justificativo.entity.js";
import { AppDataSource } from "../config/configDb.js";
import moment from "moment-timezone";

export async function createAtrasoService(rut) {
  try {
    const atrasoRepository = AppDataSource.getRepository(Atraso);

    const fechaActual = moment().tz("America/Santiago").format("YYYY-MM-DD");
    const horaActual = moment().tz("America/Santiago").format("HH:mm:ss");

    const nuevoAtraso = atrasoRepository.create({
      rut: rut,  
      fecha: fechaActual,
      hora: horaActual,
      estado: 'activo',
    });

   
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

export async function obtenerAtrasos(rut){
  try {
    const atrasoRepository = AppDataSource.getRepository(Atraso);

    const atrasos = await atrasoRepository.find({ where: { rut } });

    if(!atrasos || atrasos.length === 0) return [null, "No hay Atrasos"];

    const atrasosData = atrasos.map (({ ID_atraso, fecha, hora, estado }) => ({
      ID_atraso,
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