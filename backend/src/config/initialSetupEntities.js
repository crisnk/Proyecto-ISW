"use strict";
import Curso from "../entity/curso.entity.js";
import Materia from "../entity/materia.entity.js";
import { AppDataSource } from "./configDb.js";


async function createMaterias() {
  try {
    const materiaRepository = AppDataSource.getRepository(Materia);

    const materias = [
      "Matemáticas",
      "Historia",
      "Lenguaje",
      "Biología",
      "Química",
      "Física",
      "Educación Física",
      "Tecnología",
      "Especialidad de Mecánica",
      "Especialidad de Electricidad"
    ];

    for (const nombre of materias) {
      const materiaExistente = await materiaRepository.findOneBy({ nombre });
      if (!materiaExistente) {
        const nuevaMateria = materiaRepository.create({ nombre });
        await materiaRepository.save(nuevaMateria);
      }
    }
  } catch (error) {
    console.error("Error al crear materias predeterminadas:", error);
  }
}


async function createCursos() {
  try {
    const cursoRepository = AppDataSource.getRepository(Curso);

    const cursos = [
      { nombre: "1ro Medio A", aula: "Sala 1" },
      { nombre: "1ro Medio B", aula: "Sala 2" },
      { nombre: "1ro Medio C", aula: "Sala 3" },
      { nombre: "2do Medio A", aula: "Sala 4" },
      { nombre: "2do Medio B", aula: "Sala 5" },
      { nombre: "2do Medio C", aula: "Sala 6" },
      { nombre: "3ro Medio A", aula: "Sala 7" },
      { nombre: "3ro Medio B", aula: "Sala 8" },
      { nombre: "3ro Medio C", aula: "Sala 9" },
      { nombre: "4to Medio A", aula: "Sala 10" },
      { nombre: "4to Medio B", aula: "Sala 11" },
      { nombre: "4to Medio C", aula: "Sala 12" }
    ];

    for (const { nombre, aula } of cursos) {
      const cursoExistente = await cursoRepository.findOneBy({ nombre });
      if (!cursoExistente) {
        const nuevoCurso = cursoRepository.create({ nombre, aula });
        await cursoRepository.save(nuevoCurso);
      } 
    }
  } catch (error) {
    console.error("Error al crear cursos predeterminados:", error);
  }
}


async function createDefaultEntities() {
  await createMaterias();
  await createCursos();
}


export { createDefaultEntities };
