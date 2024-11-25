"use strict";
import { AppDataSource } from "../config/configDb.js";
import moment from "moment-timezone";
import { MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import Atraso from "../entity/atraso.entity.js";  
import Imparte from "../entity/imparte.entity.js";  
import Justificativo from "../entity/justificativo.entity.js";
import Pertenece from "../entity/pertenece.entity.js";
import User from "../entity/user.entity.js";
import Curso from "../entity/curso.entity.js";
import Materia from "../entity/materia.entity.js";  

moment.locale('es'); 

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

export async function findAtraso(rut, ID_atraso){
  try{
    const atrasoRepository = AppDataSource.getRepository(Atraso);
    const atraso = await atrasoRepository.findOne({
      where: {
        rut: rut,
        ID_atraso: ID_atraso
      },
    });
    return atraso;
  }catch (error){
    console.error('Error al buscar el atraso:', error);
    throw new Error('No se pudo buscar el atraso');

  }

}

export async function obtenerAtrasos(rut){
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

    const profesor = await userRepository.findOne({ where: { rut, rol: 'profesor' } });
    if (!profesor) {
      return [null, "Usuario no encontrado o no es un profesor"];
    }

    const curso = await cursoRepository.findOne({
      select: ["ID_curso"],
      where: { profesor: profesor.rut }
    });

    const alumnos = await perteneceRepository.find({ where: { ID_curso: curso.ID_curso } });
    if (!Array.isArray(alumnos) || alumnos.length === 0) {
      return [null, "No hay alumnos en este curso"];
    }

    const resultados = await Promise.all(alumnos.map(async (alumno) => {
      const user = await userRepository.findOne({ where: { rut: alumno.rut } });
      const atrasos = await atrasoRepository.find({ where: { rut: alumno.rut } });
      const nombreCurso = await cursoRepository.findOne({ where: { ID_curso: alumno.ID_curso } });

      const resultadosAtrasos = await Promise.all(atrasos.map(async (atraso) => {
        const justificativo = await justificativoRepository.findOne({ where: { ID_atraso: atraso.ID_atraso } });

        return {
          nombre: user.nombreCompleto,
          rut: alumno.rut,
          curso: nombreCurso.nombre,
          ID_atraso: atraso.ID_atraso,
          fecha: atraso.fecha,
          hora: atraso.hora,
          estado: atraso.estado,
          estadoJustificativo: justificativo ? justificativo.estado : "No Justificado",
        };
      }));

      return resultadosAtrasos;
    }));

    const resultadosFinales = resultados.flat().filter(atraso => atraso !== undefined); // Filtrar undefined si hay

    return [resultadosFinales.length > 0 ? resultadosFinales : null, resultadosFinales.length > 0 ? null : "No hay atrasos para los alumnos"];

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

    const perteneceRepository = AppDataSource.getRepository(Pertenece);
    const pertenece = await perteneceRepository.findOne({
      select: ["ID_curso"], 
      where: {
        rut: rut,  
      }
    });
    if (!pertenece) {
      throw new Error('No se encontró el curso para el RUT especificado.');   
    }

    const imparteRepository = AppDataSource.getRepository(Imparte);
    const imparte = await imparteRepository.findOne({
      where: {
        ID_curso: pertenece.ID_curso,
        dia: diaSemana,                      
        hora_Inicio: LessThanOrEqual(horaActual),
        hora_Fin: MoreThanOrEqual(horaActual)     
      }
    });
    if (!imparte) {
      throw new Error('No tiene una clase ahora mismo.');   
    }

    const materiaRepository = AppDataSource.getRepository(Materia);
    const materia = await materiaRepository.findOne({
      select: ["nombre"], 
      where: {
        ID_materia: imparte.ID_materia,   
      }
    });

    const cursoRepository = AppDataSource.getRepository(Curso);
    const curso = await cursoRepository.findOne({
      select: ["nombre", "aula"], 
      where: {
        ID_curso: imparte.ID_curso,   
      }
    });

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      select: ["nombreCompleto"], 
      where: {
        rut: imparte.rut,   
      }
    });

    return {
      materia: materia?.nombre || "Materia no encontrada",
      curso: curso?.nombre || "Curso no encontrado",
      aula: curso?.aula || "Aula no asignada",
      profesor: user?.nombreCompleto || "Profesor no encontrado"
    };

  } catch (error) {
    console.error('Error al buscar el atraso:', error);
    throw new Error('No se pudo buscar el atraso');
  }
}