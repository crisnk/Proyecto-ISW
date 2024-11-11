"use strict";
import User from "../entity/user.entity.js"
import Atraso from "../entity/atraso.entity.js";  
import Justificativo  from "../entity/justificativo.entity.js";
import Pertenece from "../entity/pertenece.entity.js";
import Curso from "../entity/curso.entity.js";
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

export async function obtenerAtrasos(rut) {
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
    // Declarar repositorios al inicio
    const userRepository = AppDataSource.getRepository(User);
    const perteneceRepository = AppDataSource.getRepository(Pertenece);
    const cursoRepository = AppDataSource.getRepository(Curso);
    const atrasoRepository = AppDataSource.getRepository(Atraso);
    const justificativoRepository = AppDataSource.getRepository(Justificativo);

    // Buscar usuario
    const user = await userRepository.findOne({ where: { rut } });
    if (!user) {
      return [null, "Usuario no encontrado"];
    }

    // Buscar pertenencia
    const pertenece = await perteneceRepository.findOne({ where: { rut } });
    let cursoNombre = "Sin curso asignado";

    if (pertenece) {
      const curso = await cursoRepository.findOne({ where: { ID_curso: pertenece.ID_curso } });
      if (curso) {
        cursoNombre = curso.nombre; 
      }
    }

    // Buscar atrasos
    const atrasos = await atrasoRepository.find({ where: { rut } });
    if (!atrasos || atrasos.length === 0) {
      return [null, "No hay atrasos para el alumno"];
    }

    // Obtener resultados
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