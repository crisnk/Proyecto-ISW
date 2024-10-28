"use strict";
import User from "../entity/user.entity.js";
import Especialidad from "../entity/especialidad.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

export async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) return;

    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Salazar Jara",
          rut: "21.308.770-3",
          email: "administrador2024@gmail.cl",
          password: await encryptPassword("admin1234"),
          rol: "administrador",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Jefe UTP Predeterminado",
          rut: "12.345.678-9",
          email: "jefeutp@gmail.cl",
          password: await encryptPassword("jefe1234"),
          rol: "jefeUTP",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Profesor Predeterminado",
          rut: "11.223.344-5",
          email: "profesor@gmail.cl",
          password: await encryptPassword("profesor1234"),
          rol: "profesor",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Sebastián Ampuero Belmar",
          rut: "21.151.897-9",
          email: "usuario1.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "alumno",
        })
      ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Alexander Benjamín Marcelo Carrasco Fuentes",
            rut: "20.630.735-8",
            email: "usuario2.2024@gmail.cl",
            password: await encryptPassword("user1234"),
            rol: "alumno",
          }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Pablo Andrés Castillo Fernández",
          rut: "20.738.450-K",
          email: "usuario3.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "alumno",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Felipe Andrés Henríquez Zapata",
          rut: "20.976.635-3",
          email: "usuario4.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "alumno",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Meza Ortega",
          rut: "21.172.447-1",
          email: "usuario5.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "alumno",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Juan Pablo Rosas Martin",
          rut: "20.738.415-1",
          email: "usuario6.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "alumno",
        }),
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
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