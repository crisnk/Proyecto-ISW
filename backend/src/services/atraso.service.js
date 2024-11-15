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

export async function obtenerAtrasos(){
  try {
    const atrasoRepository = AppDataSource.getRepository(Atraso);
    const justificativoRepository = AppDataSource.getRepository(Justificativo);

    const atrasos = await atrasoRepository.find({ where: { rut } });
    if (!atrasos || atrasos.length === 0) {
      return [null, "No hay Atrasos"];
    }
    
    const resultados = await Promise.all(atrasos.map(async (atraso) => {
      const justificativo = await justificativoRepository.findOne({ where: { ID_atraso: atraso.ID_atraso } });
      return {
        ID_atraso: atraso.ID_atraso,
        fecha: atraso.fecha,
        hora: atraso.hora,
        estado: atraso.estado,
        estadoJustificativo: justificativo ? justificativo.estado : "No Justificado",
      };
    }));

    return [resultados, null];
  } catch (error) {
    console.error("Error al obtener los atrasos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function obtenerAtrasosAlumnos(rut) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const perteneceRepository = AppDataSource.getRepository(Pertenece);
    const cursoRepository = AppDataSource.getRepository(Curso);
    const atrasoRepository = AppDataSource.getRepository(Atraso);
    const justificativoRepository = AppDataSource.getRepository(Justificativo);

    const user = await userRepository.findOne({ where: { rut } });
    if (!user) {
      return [null, "Usuario no encontrado"];
    }

    const pertenece = await perteneceRepository.findOne({ where: { rut } });
    let cursoNombre = "Sin curso asignado";

    if (pertenece) {
      const curso = await cursoRepository.findOne({ where: { ID_curso: pertenece.ID_curso } });
      if (curso) {
        cursoNombre = curso.nombre; 
      }
    }

    const atrasos = await atrasoRepository.find({ where: { rut } });
    if (!atrasos || atrasos.length === 0) {
      return [null, "No hay atrasos para el alumno"];
    }

    const resultados = await Promise.all(atrasos.map(async (atraso) => {  
      const justificativo = await justificativoRepository.findOne({ where: { ID_atraso: atraso.ID_atraso } });
      return {
        nombre: user.nombreCompleto,
        rut: user.rut,
        curso: cursoNombre, 
        id_atraso: atraso.ID_atraso,
        fecha: atraso.fecha,
        hora: atraso.hora,
        estadoJustificativo: justificativo ? justificativo.estado : "No Justificado",
      };
    }));

    return [resultados, null];
  } catch (error) {
    console.error("Error al obtener los atrasos de los alumnos:", error);
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