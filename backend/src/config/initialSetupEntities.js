"use strict";
import Curso from "../entity/curso.entity.js";
import Materia from "../entity/materia.entity.js";
import { AppDataSource } from "./configDb.js";

async function createCursos() {
  try {
    const cursoRepository = AppDataSource.getRepository(Curso);

    const cursoExistente = await cursoRepository.findOneBy({ nombre: "1ro Medio A" });
    if (!cursoExistente) {
      const nuevoCurso = cursoRepository.create({
        nombre: "1ro Medio A",
        aula: "Aula 101",
        rut: "11.223.344-5"
      });
      await cursoRepository.save(nuevoCurso);
      console.log("* => Curso por defecto creado");
    }
  } catch (error) {
    console.error("Error al crear curso predeterminado:", error);
  }
}

async function createMaterias() {
  try {
    const materiaRepository = AppDataSource.getRepository(Materia);

    const materiaExistente = await materiaRepository.findOneBy({ nombre: "Matemáticas" });
    if (!materiaExistente) {
      const nuevaMateria = materiaRepository.create({
        nombre: "Matemáticas",
      });
      await materiaRepository.save(nuevaMateria);
      console.log("* => Materia por defecto creada");
    }
  } catch (error) {
    console.error("Error al crear materia predeterminada:", error);
  }
}

async function createDefaultEntities() {
  await createCursos();
  await createMaterias();
  console.log("* => Configuración inicial de entidades completada");
}

export { createDefaultEntities };
