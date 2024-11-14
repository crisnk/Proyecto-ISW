"use strict";
import User from "../entity/user.entity.js";
import Especialidad from "../entity/especialidad.entity.js";
import Pertenece from "../entity/pertenece.entity.js";
import Curso from "../entity/curso.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

export async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const perteneceRepository = AppDataSource.getRepository(Pertenece);
    const cursoRepository = AppDataSource.getRepository(Curso);

    const count = await userRepository.count();
    if (count > 0) return;

    const defaultCurso = await cursoRepository.findOne({ where: { nombre: "1ro Medio A" } });
    if (!defaultCurso) {
      throw new Error("Curso predeterminado no encontrado.");
    }

    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Administrador",
          rut: "21.308.770-3",
          email: "administrador@gmail.cl",
          password: await encryptPassword("admin1234"),
          rol: "administrador",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Jefe UTP",
          rut: "12.345.678-9",
          email: "jefeutp@gmail.cl",
          password: await encryptPassword("jefeutp1234"),
          rol: "jefeUTP",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Profesor Uno",
          rut: "11.223.344-5",
          email: "profesor@gmail.cl",
          password: await encryptPassword("profesor1234"),
          rol: "profesor",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Encargado de práctica",
          rut: "20.738.415-2",
          email: "profesorEDP@gmail.cl",
          password: await encryptPassword("profesorEDP1234"),
          rol: "EDP",
        }),
      ),
      (async () => {
        const alumno1 = userRepository.create({
          nombreCompleto: "Alumno Uno",
          rut: "21.151.897-9",
          email: "alumno1@gmail.cl",
          password: await encryptPassword("alumno1234"),
          rol: "alumno",
        });
        const savedAlumno1 = await userRepository.save(alumno1);
        await perteneceRepository.save(
          perteneceRepository.create({
            rut: savedAlumno1.rut,
            ID_curso: defaultCurso.ID_curso,
          })
        );
      })(),
      (async () => {
        const alumno2 = userRepository.create({
          nombreCompleto: "Alumno Dos",
          rut: "20.630.735-8",
          email: "alumno2@gmail.cl",
          password: await encryptPassword("alumno1234"),
          rol: "alumno",
        });
        const savedAlumno2 = await userRepository.save(alumno2);
        await perteneceRepository.save(
          perteneceRepository.create({
            rut: savedAlumno2.rut,
            ID_curso: defaultCurso.ID_curso,
          })
        );
      })(),
    ]);
    
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export async function crearEspecialidades() {
  try {
    const especialidadRepository = AppDataSource.getRepository(Especialidad);

    const count = await especialidadRepository.count();
    if (count > 0) return;

    await Promise.all([
      especialidadRepository.save(
        especialidadRepository.create({
          ID_especialidad: 1,
          nombre: "Mecánica automotriz",
        })
      ),
      especialidadRepository.save(
        especialidadRepository.create({
          ID_especialidad: 2,
          nombre: "Mecánica Industrial",
        })
      ),
      especialidadRepository.save(
        especialidadRepository.create({
          ID_especialidad: 3,
          nombre: "Electricidad",
        })
      ),
      especialidadRepository.save(
        especialidadRepository.create({
          ID_especialidad: 4,
          nombre: "Electrónica",
        })
      ),
      especialidadRepository.save(
        especialidadRepository.create({
          ID_especialidad: 5,
          nombre: "Telecomunicación",
        })
      ),
    ]);
    console.log("* => Especialidades creadas exitosamente");
  } catch (error) {
    console.error("Error al crear especialidades:", error);
  }
}
