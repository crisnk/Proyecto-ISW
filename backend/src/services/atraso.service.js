"use strict";
import Atraso from "../entity/atraso.entity.js";  
import { AppDataSource } from "../config/configDb.js";
import moment from "moment-timezone";
import Imparte from "../entity/imparte.entity.js";  
import { MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

moment.locale('es'); // Establece el idioma en español

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

export async function obtenerInfoAtraso(rut) {
  try {

    const fechaActual = moment().tz("America/Santiago").format("YYYY-MM-DD");
    const horaActual = moment().tz("America/Santiago").format("HH:mm:ss");
    const diaSemana = moment.tz("America/Santiago").format('dddd'); // Día de la semana en español

    const imparteRepository = AppDataSource.getRepository(Imparte);
    console.log(fechaActual);
    console.log(diaSemana);
    console.log(horaActual);

    const imparte = await imparteRepository.findOne({
      where: {
        rut: rut,
        dia: diaSemana,                      
        hora_Inicio: LessThanOrEqual(horaActual),
        hora_Fin: MoreThanOrEqual(horaActual)     
      }
    });

    if (imparte) {
      return imparte;
    } else {
      throw new Error('No se encontró una coincidencia para el horario actual.');
    }

  } catch (error) {
    console.error('Error al buscar el atraso:', error);
    throw new Error('No se pudo buscar el atraso');
  }
}