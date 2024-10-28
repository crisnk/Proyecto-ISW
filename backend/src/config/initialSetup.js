"use strict";
import User from "../entity/user.entity.js";
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
          RUN: "21.308.770-3",
          nombre: "Admin Generico",
          email: "admin@gmail.com",
          password: await encryptPassword("admin1234"),
          direccion: "Concepcion",
          rol: "admin",
        }),
      ),
      userRepository.save(
        userRepository.create({
          RUN: "21.151.897-9",
          nombre: "Usuario Generico",
          email: "usuario@gmail.com",
          password: await encryptPassword("user1234"),
          direccion: "Concepcion",
          rol: "alumno",
        })
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}