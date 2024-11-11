"use strict";
import User from "../entity/user.entity.js";
import Pertenece from "../entity/pertenece.entity.js";
import Curso from "../entity/curso.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const userFound = await userRepository.findOne({
      where: { email }
    });

    if (!userFound) {
      return [null, createErrorMessage("email", "El correo electrónico es incorrecto")];
    }

    const isMatch = await comparePassword(password, userFound.password);

    if (!isMatch) {
      return [null, createErrorMessage("password", "La contraseña es incorrecta")];
    }

    const payload = {
      nombreCompleto: userFound.nombreCompleto,
      email: userFound.email,
      rut: userFound.rut,
      rol: userFound.rol,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const perteneceRepository = AppDataSource.getRepository(Pertenece);
    const cursoRepository = AppDataSource.getRepository(Curso);

    const { nombreCompleto, rut, email, password, rol, curso } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message,
    });

    const existingEmailUser = await userRepository.findOne({ where: { email } });
    if (existingEmailUser) {
      return [null, createErrorMessage("email", "Correo electrónico en uso")];
    }

    const existingRutUser = await userRepository.findOne({ where: { rut } });
    if (existingRutUser) {
      return [null, createErrorMessage("rut", "Rut ya asociado a una cuenta")];
    }

    const newUser = userRepository.create({
      nombreCompleto,
      email,
      rut,
      password: await encryptPassword(password),
      rol,
    });

    await userRepository.save(newUser);

    if (rol === "alumno") {
      if (!curso) return [null, { dataInfo: "curso", message: "Debe asignarse un curso al alumno." }];
  
      const existingCurso = await cursoRepository.findOne({ where: { ID_curso: curso } });
      if (!existingCurso) {
          console.log("Curso no existe:", curso); 
          return [null, { dataInfo: "curso", message: "El curso especificado no existe." }];
      }
  
      const newPertenece = perteneceRepository.create({ rut, ID_curso: curso });
      await perteneceRepository.save(newPertenece);
  }
  

    const { password: _, ...dataUser } = newUser; 
    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}
