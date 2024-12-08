"use strict";
import { AppDataSource } from "../config/configDb.js";
import moment from "moment-timezone";
import { MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import Atraso from "../entity/atraso.entity.js";  
import Imparte from "../entity/imparte.entity.js";  
import Justificativo from "../entity/justificativo.entity.js";
import Pertenece from "../entity/pertenece.entity.js";
import User from "../entity/user.entity.js";
import Curso from "../entity/curso.entity.js";
import Materia from "../entity/materia.entity.js";  

moment.locale('es'); 
async function buscarPertenecePorRut(rut) {
  try {
    const perteneceRepository = AppDataSource.getRepository(Pertenece);
    const pertenece = await perteneceRepository.findOne({
      select: ["ID_curso"], 
      where: { rut: rut } // Usar el rut proporcionado para la consulta
    });

    return pertenece; 
  } catch (error) {
    console.error("Error al buscar el curso del alumno:", error);
    throw new Error("Error al buscar el curso del alumno"); 
  }
}

async function buscarImparte(ID_curso, diaSemana, horaActual) {
  try {
    const imparteRepository = AppDataSource.getRepository(Imparte);
    const imparte = await imparteRepository.findOne({
      where: {
        ID_curso: ID_curso,
        dia: diaSemana,                      
        hora_Inicio: LessThanOrEqual(horaActual),
        hora_Fin: MoreThanOrEqual(horaActual)     
      }
    });

    return imparte; 
  } catch (error) {
    console.error("Error al buscar el clase del alumno:", error);
    throw new Error("Error al buscar clase del alumno"); 
  }
}

export async function createAtrasoService(rut) {
  try {

    const fechaActual = moment().tz("America/Santiago").format("YYYY-MM-DD");
    const horaActual = moment().tz("America/Santiago").format("HH:mm:ss");
    const diaSemana = moment.tz("America/Santiago").format('dddd'); // Día de la semana en español
   
    const pertenece = await buscarPertenecePorRut(rut);
    if (!pertenece) {
      throw new Error('El alumno no pertenece a un curso.');   
    }
    
    const imparte = await buscarImparte(pertenece.ID_curso, diaSemana, horaActual);
    if (!imparte) {
      throw new Error('Alumno no tiene una clase ahora mismo.');   
    }

    const atrasoRepository = AppDataSource.getRepository(Atraso);
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
    return [null, error.message]; 
  }
}

export async function findAtraso(rut, ID_atraso){
  try{
    const atrasoRepository = AppDataSource.getRepository(Atraso);
    const atraso = await atrasoRepository.findOne({
      where: {
        rut: rut,
        ID_atraso: ID_atraso,
        estado: "activo"
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

    const horaActual = moment().tz("America/Santiago").format("HH:mm:ss");
    const diaSemana = moment.tz("America/Santiago").format('dddd'); // Día de la semana en español

    const pertenece = await buscarPertenecePorRut(rut);
    if (!pertenece) {
      throw new Error('El alumno no pertenece a un curso.');   
    }
    
    const imparte = await buscarImparte(pertenece.ID_curso, diaSemana, horaActual);
    if (!imparte) {
      throw new Error('Alumno no tiene una clase ahora mismo.');   
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

export async function findAtrasosJustificables(rut){
  try{

    const fechaActual = moment().tz("America/Santiago").startOf('day').toDate();
    const fechaLimite = moment().tz("America/Santiago").startOf('day').subtract(4, 'days') //4 diás atras, el dia del atraso cuenta para justificar                  

    const atrasoRepository = AppDataSource.getRepository(Atraso);
    const atrasos = await atrasoRepository.find({
      where: {
        rut: rut,
        estado: "activo",
        fecha: Between(fechaLimite, fechaActual)  
      },
    });

    if (!atrasos.length) {
      throw new Error('No se encontraron atrasos para este alumno en el rango de fechas.');
    }

    const resultado = [];

    const pertenece = await buscarPertenecePorRut(rut);
    if (!pertenece) {
      throw new Error('El alumno no pertenece a un curso.');   
    }

    for (const atraso of atrasos) {
      try {
        const diaSemana = moment(atraso.fecha).isoWeekday(); 
        const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
        const nombreDia = diasSemana[diaSemana - 1]; // Restamos 1 porque el índice del array empieza en 0
        console.log('nombreDia:', nombreDia);
        const imparte = await buscarImparte(pertenece.ID_curso, nombreDia, atraso.hora);
        if (!imparte) {
          console.warn(`No se encontró una clase para el curso ${pertenece.ID_curso} a la hora ${atraso.hora}.`);
          continue; // Si no hay clase, pasar al siguiente atraso
        }

        // 3️⃣ Obtener el nombre de la materia asociada
        const materiaRepository = AppDataSource.getRepository(Materia);
        const materia = await materiaRepository.findOne({
          select: ["nombre"], 
          where: {
            ID_materia: imparte.ID_materia,   
          }
        });
        const fecha = moment(atraso.fecha).format('YYYY-MM-DD');
        resultado.push({
          fecha: fecha,
          hora: atraso.hora, 
          materia: materia ? materia.nombre : 'Sin materia asignada'
        });

      } catch (error) {
        console.error(`Error procesando el atraso con ID ${atraso.ID_atraso}:`, error);
      }
    }

    return resultado;  
    

  }catch (error){
    console.error('Error al buscar los atrasos:', error);
    throw new Error('No se pudo buscar los atrasos');
  }
}