"use strict";
import { AppDataSource } from "../config/configDb.js";
import Curso from "../entity/curso.entity.js";
import Imparte from "../entity/imparte.entity.js";
import Materia from "../entity/materia.entity.js";
import User from "../entity/user.entity.js";
import { Not } from "typeorm";
import { cursoValidation, horarioValidation, materiaValidation, 
  paginationAndFilterValidation, validarHorario  } from "../validations/horario.validation.js";


export const asignaHorarioService = async (horarioData) => {
  const { rut, horario } = horarioData; 

  if (!rut || !Array.isArray(horario) || horario.length === 0) {
    throw new Error("Datos incompletos para asignar el horario.");
  }

  const repository = AppDataSource.getRepository(Imparte);

  for (const bloque of horario) {
    const { ID_materia, ID_curso, dia, bloque: hora } = bloque;
  
    if (!ID_materia || !ID_curso || !dia || !hora) {
      throw new Error("Datos incompletos en el bloque de horario.");
    }
    
    validarHorario(dia, hora);

    const { error } = horarioValidation.validate(
      { ID_materia, ID_curso, rut, dia, bloque: hora },
      { abortEarly: false }
    );

    if (error) {
      throw new Error(`Errores de validación: ${error.details.map((err) => err.message).join(", ")}`);
    }
    
    const conflicto = await repository.findOne({
      where: [
        { rut, dia, bloque: hora }, 
        { ID_curso, dia, bloque: hora }, 
      ],
    });

    if (conflicto) {
      console.log(`Conflicto encontrado en ${dia} ${hora}, eliminando conflicto.`);
      await repository.remove(conflicto);
    }

    const nuevoHorario = repository.create({
      ID_materia,
      ID_curso,
      rut,
      dia,
      bloque: hora,
    });
  
    await repository.save(nuevoHorario);
  }

  return { message: "Horario asignado correctamente." };
};

  
  export const modificaHorarioService = async (id, horarioData) => {
    const { error } = horarioValidation.validate(horarioData, { abortEarly: false });
    if (error) {
      throw new Error(error.details.map((err) => err.message).join(", "));
    }
  
    const { ID_materia, ID_curso, rut, dia, bloque } = horarioData;
    validarHorario(dia, bloque);
    await validarDatosHorario(ID_materia, ID_curso, rut);
  
    const repository = AppDataSource.getRepository(Imparte);
  
    const horarioExistente = await repository.findOneBy({ id });
  
    if (!horarioExistente) {
      throw new Error("Horario no encontrado.");
    }
  
    const conflictoHorario = await repository.findOne({
      where: [
        { rut, dia, bloque, id: Not(id) },
        { ID_curso, dia, bloque, id: Not(id) },
      ],
    });
  
    if (conflictoHorario) {
      throw new Error(
        "Conflicto de horario detectado. El profesor o curso ya tiene una clase en este bloque."
      );
    }
  
    Object.assign(horarioExistente, { ID_materia, ID_curso, rut, dia, bloque });
  
    await repository.save(horarioExistente);
  
    return horarioExistente;
  };
  
export const eliminarHorarioService = async (id) => {
  const repository = AppDataSource.getRepository(Imparte);
  const horario = await repository.findOneBy({ id });

  if (!horario) {
    throw new Error("Horario no encontrado.");
  }

  await repository.remove(horario);
  return horario;
};
export const getHorariosByProfesor = async (rut, userRut) => {
  const finalRut = rut || userRut; 
  if (!finalRut) {
    throw new Error("El RUT es obligatorio para consultar horarios.");
  }

  const repository = AppDataSource.getRepository(Imparte);
  const horarios = await repository.find({
    where: { rut: finalRut },
    relations: ["materia", "curso", "profesor"],
  });

  console.log("Consultando horarios para RUT:", finalRut);
  console.log("Horarios obtenidos:", horarios);

  return horarios;
};


export const getHorariosByCurso = async (ID_curso) => {
  try {
    const cursoExistente = await AppDataSource.getRepository(Curso).findOneBy({ ID_curso });
    if (!cursoExistente) {
      throw new Error(`El curso con ID ${ID_curso} no existe en la base de datos.`);
    }

    const repository = AppDataSource.getRepository(Imparte);
    const horarios = await repository.find({
      where: { ID_curso },
      relations: ["materia", "curso", "profesor"],
    });

    const formattedHorario = initializeHorario();

    if (horarios.length > 0) {
      horarios.forEach((item) => {
        formattedHorario[item.dia][item.bloque] = item.materia.nombre;
      });
    }

    return {
      message: "Horarios obtenidos con éxito.",
      data: formattedHorario,
    };
  } catch (error) {
    console.error("Error en getHorariosByCurso:", error);
    throw error;
  }
};

const initializeHorario = () => {
  const recreoHoras = ["10:30 - 11:15", "13:00 - 13:45"];
  const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes"];
  const horas = [
    "08:00 - 08:45",
    "08:50 - 09:35",
    "09:40 - 10:25",
    "10:30 - 11:15",
    "11:20 - 12:05",
    "12:10 - 12:55",
    "13:00 - 13:45",
    "14:30 - 15:15",
    "15:20 - 16:05",
    "16:10 - 16:55",
    "17:00 - 17:45",
  ];

  const newHorario = {};
  diasSemana.forEach((dia) => {
    newHorario[dia] = {};
    horas.forEach((hora) => {
      newHorario[dia][hora] = recreoHoras.includes(hora) ? "Recreo" : "Sin asignar";
    });
  });
  return newHorario;
};


export const getAllHorarios = async (query) => {
 
  const { error, value } = paginationAndFilterValidation.validate(query, { abortEarly: false });
  if (error) {
    throw new Error(error.details.map((err) => err.message).join(", "));
  }

  const { profesor, curso, page = 1, limit = 10 } = value;

  const repository = AppDataSource.getRepository(Imparte);

  const queryBuilder = repository
    .createQueryBuilder("horario")
    .leftJoinAndSelect("horario.materia", "materia")
    .leftJoinAndSelect("horario.curso", "curso")
    .leftJoinAndSelect("horario.profesor", "profesor");

  if (profesor) {
    queryBuilder.andWhere(
      "(profesor.rut = :profesor OR LOWER(profesor.nombreCompleto) = LOWER(:profesor))", 
      { profesor }
    );
  }

  if (curso) {
    queryBuilder.andWhere("curso.nombre = :curso", { curso });
  }

  const total = await queryBuilder.getCount();

  const data = await queryBuilder
    .skip((page - 1) * limit) 
    .take(limit)
    .getMany();

  return {
    data,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};


export const getMaterias = async () => {
  const repository = AppDataSource.getRepository(Materia);
  const materias = await repository.find();
  if (materias.length === 0) {
    throw new Error("No se encontraron materias.");
  }
  return materias;
};

export const getCursos = async () => {
  try {
    const repository = AppDataSource.getRepository(Curso);
    const cursos = await repository.find();
    if (!cursos.length) {
      throw new Error("No se encontraron cursos en la base de datos.");
    }
    return cursos.map(curso => ({
      ID_curso: curso.ID_curso,
      nombre: curso.nombre,
    }));
  } catch (error) {
    console.error("Error en getCursos:", error);
    throw error;
  }
};


export const getProfesores = async () => {
  const repository = AppDataSource.getRepository(User);
  const profesores = await repository.find({ where: { rol: "profesor" } });
  if (profesores.length === 0) {
    throw new Error("No se encontraron profesores.");
  }
  return profesores;
};

const validarDatosHorario = async (ID_materia, ID_curso, rut) => {
  const materia = await AppDataSource.getRepository(Materia).findOneBy({ ID_materia });
  if (!materia) {
    throw new Error("La materia no existe en la base de datos.");
  }

  const curso = await AppDataSource.getRepository(Curso).findOneBy({ ID_curso });
  if (!curso) {
    throw new Error("El curso no existe en la base de datos.");
  }

  const user = await AppDataSource.getRepository(User).findOneBy({ rut });
  if (!user) {
    throw new Error("El RUT no existe en la base de datos.");
  }
};
export const crearMateriaService = async (materiaData) => {
  const { error } = materiaValidation.validate(materiaData, { abortEarly: false });
  if (error) {
    throw new Error(`Errores de validación: ${error.details.map(err => err.message).join(", ")}`);
  }

  const materiaRepository = AppDataSource.getRepository(Materia);
  const materiaExistente = await materiaRepository.findOneBy({ nombre: materiaData.nombre });
  if (materiaExistente) {
    throw new Error("La materia ya existe.");
  }

  const nuevaMateria = materiaRepository.create(materiaData);
  await materiaRepository.save(nuevaMateria);

  return nuevaMateria;
};

export const crearCursoService = async (cursoData) => {
  const { error } = cursoValidation.validate(cursoData, { abortEarly: false });
  if (error) {
    throw new Error("Errores de validación: " + error.details.map(err => err.message).join(", "));
  }

  const cursoRepository = AppDataSource.getRepository(Curso);
  const cursoExistente = await cursoRepository.findOneBy({ nombre: cursoData.nombre });
  if (cursoExistente) {
    throw new Error("El curso ya existe.");
  }

  const nuevoCurso = cursoRepository.create(cursoData);
  await cursoRepository.save(nuevoCurso);

  return nuevoCurso;
};


export const eliminarMateriaService = async (ID_materia) => {
  const imparteRepository = AppDataSource.getRepository(Imparte);
  const materiaRepository = AppDataSource.getRepository(Materia);
  
  await imparteRepository.delete({ ID_materia });
  
  const materia = await materiaRepository.findOneBy({ ID_materia });
  if (!materia) {
    throw new Error("Materia no encontrada.");
  }
  await materiaRepository.remove(materia);
  return materia;
};


export const eliminarCursoService = async (ID_curso) => {
  const impartirRepository = AppDataSource.getRepository(Imparte);
  const cursoRepository = AppDataSource.getRepository(Curso);

  await impartirRepository.delete({ ID_curso });
  
  const curso = await cursoRepository.findOneBy({ ID_curso });
  if (!curso) {
    throw new Error("Curso no encontrado.");
  }
  await cursoRepository.remove(curso);
  return curso;
};


