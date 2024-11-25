"use strict";
import User from "../entity/user.entity.js";
import Especialidad from "../entity/especialidad.entity.js";
import Pertenece from "../entity/pertenece.entity.js";
import Curso from "../entity/curso.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function registrarUsuarios(alumnosCurso, userRepository, perteneceRepository, encryptPassword){
  for (const alumno of alumnosCurso) {
    await userRepository.save(
      userRepository.create({
        nombreCompleto: alumno.nombre,
        rut: alumno.rut,
        email: alumno.email,
        rol: "alumno",
        password: await encryptPassword("alumno1234"),
      })
    );

  await perteneceRepository.save(
      perteneceRepository.create({
        rut: alumno.rut,
        ID_curso: alumno.ID_curso,
      })
    );
  }

}
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
    const alumnos = [
      { rut: "21.025.001-1", nombre: "Juan Silva", email: "juan.silva@gmail.cl", ID_curso: 1 },
      { rut: "21.025.002-2", nombre: "Ana Gómez", email: "ana.gomez@gmail.cl", ID_curso: 1 },
      { rut: "21.025.003-3", nombre: "Pedro Morales", email: "pedro.morales@gmail.cl", ID_curso: 1 },
      { rut: "21.025.004-4", nombre: "María López", email: "maria.lopez@gmail.cl", ID_curso: 1 },
      { rut: "21.025.005-5", nombre: "Luis Fernández", email: "luis.fernandez@gmail.cl", ID_curso: 1 },
      { rut: "21.025.006-6", nombre: "Sofia Ramírez", email: "sofia.ramirez1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.007-7", nombre: "Daniela Ruiz", email: "daniela.ruiz@gmail.cl", ID_curso: 1 },
      { rut: "21.025.008-8", nombre: "Carlos Jiménez", email: "carlos.jimenez@gmail.cl", ID_curso: 1 },
      { rut: "21.025.009-9", nombre: "Laura Martínez", email: "laura.martinez1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.010-0", nombre: "Javier Pérez", email: "javier.perez@gmail.cl", ID_curso: 1 },
      { rut: "21.025.011-1", nombre: "Gabriela Sánchez", email: "gabriela.sanchez@gmail.cl", ID_curso: 1 },
      { rut: "21.025.012-2", nombre: "Francisco Castro", email: "francisco.castro@gmail.cl", ID_curso: 1 },
      { rut: "21.025.013-3", nombre: "Valentina Soto", email: "valentina.soto@gmail.cl", ID_curso: 1 },
      { rut: "21.025.014-4", nombre: "Andrés Morales", email: "andres.morales@gmail.cl", ID_curso: 1 },
      { rut: "21.025.015-5", nombre: "Catalina Salazar", email: "catalina.salazar@gmail.cl", ID_curso: 1 },
      { rut: "21.025.016-6", nombre: "Felipe Ortega", email: "felipe.ortega@gmail.cl", ID_curso: 1 },
      { rut: "21.025.017-7", nombre: "Camila González", email: "camila.gonzalez1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.018-8", nombre: "Nicolás Paredes", email: "nicolas.paredes@gmail.cl", ID_curso: 1 },
      { rut: "21.025.019-9", nombre: "Isabel Torres", email: "isabel.torres@gmail.cl", ID_curso: 1 },
      { rut: "21.025.020-0", nombre: "Ricardo Molina", email: "ricardo.molina@gmail.cl", ID_curso: 1 },
      { rut: "21.025.021-1", nombre: "Fernando Castillo", email: "fernando.castillo@gmail.cl", ID_curso: 2 },
      { rut: "21.025.022-2", nombre: "Marta Medina", email: "marta.medina@gmail.cl", ID_curso: 2 },
      { rut: "21.025.023-3", nombre: "Alejandro Pérez", email: "alejandro.perez@gmail.cl", ID_curso: 2 },
      { rut: "21.025.024-4", nombre: "Carmen Soto", email: "carmen.soto@gmail.cl", ID_curso: 2 },
      { rut: "21.025.025-5", nombre: "Cristian Ruiz", email: "cristian.ruiz@gmail.cl", ID_curso: 2 },
      { rut: "21.025.026-6", nombre: "Juliana García", email: "juliana.garcia@gmail.cl", ID_curso: 2 },
      { rut: "21.025.027-7", nombre: "Héctor Mendoza", email: "hector.mendoza@gmail.cl", ID_curso: 2 },
      { rut: "21.025.028-8", nombre: "Natalia Herrera", email: "natalia.herrera@gmail.cl", ID_curso: 2 },
      { rut: "21.025.029-9", nombre: "Guillermo Díaz", email: "guillermo.diaz@gmail.cl", ID_curso: 2 },
      { rut: "21.025.030-0", nombre: "Ángela Rivas", email: "angela.rivas@gmail.cl", ID_curso: 2 },
      { rut: "21.025.031-1", nombre: "Simón López", email: "simon.lopez@gmail.cl", ID_curso: 2 },
      { rut: "21.025.032-2", nombre: "Carolina Vargas", email: "carolina.vargas@gmail.cl", ID_curso: 2 },
      { rut: "21.025.033-3", nombre: "Mauricio Ruiz", email: "mauricio.ruiz@gmail.cl", ID_curso: 2 },
      { rut: "21.025.034-4", nombre: "Ana María Ramírez", email: "ana.maria.ramirez@gmail.cl", ID_curso: 2 },
      { rut: "21.025.035-5", nombre: "Ricardo Romero", email: "ricardo.romero@gmail.cl", ID_curso: 2 },
      { rut: "21.025.036-6", nombre: "Paola García", email: "paola.garcia@gmail.cl", ID_curso: 2 },
      { rut: "21.025.037-7", nombre: "Oscar Moreno", email: "oscar.moreno@gmail.cl", ID_curso: 2 },
      { rut: "21.025.038-8", nombre: "Lucía González", email: "lucia.gonzalez@gmail.cl", ID_curso: 2 },
      { rut: "21.025.039-9", nombre: "Mauricio Silva", email: "mauricio.silva@gmail.cl", ID_curso: 2 },
      { rut: "21.025.040-0", nombre: "Sara Molina", email: "sara.molina@gmail.cl", ID_curso: 2 },
      { rut: "21.025.041-1", nombre: "Joaquín Salinas", email: "joaquin.salinas@gmail.cl", ID_curso: 3 },
      { rut: "21.025.042-2", nombre: "Felipe Fernández", email: "felipe.fernandez1@gmail.cl", ID_curso: 3 },
      { rut: "21.025.043-3", nombre: "Marcela Soto", email: "marcela.soto@gmail.cl", ID_curso: 3 },
      { rut: "21.025.044-4", nombre: "Valeria Vargas", email: "valeria.vargas3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.045-5", nombre: "Rodrigo Moreno", email: "rodrigo.moreno3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.046-6", nombre: "Sofía Arias", email: "sofia.arias3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.047-7", nombre: "Javier Cortés", email: "javier.cortes3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.048-8", nombre: "Daniel Salazar", email: "daniel.salaza3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.049-9", nombre: "Andrea Díaz", email: "andrea.diaz3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.050-0", nombre: "Samuel Soto", email: "samuel.soto3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.051-1", nombre: "Mariana González", email: "mariana.gonzalez3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.052-2", nombre: "Eduardo Ramírez", email: "eduardo.ramirez3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.053-3", nombre: "Gabriel Romero", email: "gabriel.romero3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.054-4", nombre: "Catherine Morales", email: "catherine.morales3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.055-5", nombre: "Julio Rodríguez", email: "julio.rodriguez3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.056-6", nombre: "Cristina Medina", email: "cristina.medina3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.057-7", nombre: "Marta Herrera", email: "marta.herrera3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.058-8", nombre: "Hugo Delgado", email: "hugo.delgado3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.059-9", nombre: "Laura Álvarez", email: "laura.alvarez@gmail.cl", ID_curso: 3 },
      { rut: "21.025.060-0", nombre: "David Paredes", email: "david.paredes@gmail.cl", ID_curso: 3 },
      { rut: "21.025.061-1", nombre: "José Martínez", email: "jose.martinez@gmail.cl", ID_curso: 4 },
      { rut: "21.025.062-2", nombre: "Mariana Hernández", email: "mariana.hernandez@gmail.cl", ID_curso: 4 },
      { rut: "21.025.063-3", nombre: "Daniel Díaz", email: "daniel.diaz@gmail.cl", ID_curso: 4 },
      { rut: "21.025.064-4", nombre: "Natalia Fernández", email: "natalia.fernandez@gmail.cl", ID_curso: 4 },
      { rut: "21.025.065-5", nombre: "Francisco Cortés", email: "francisco.cortes@gmail.cl", ID_curso: 4 },
      { rut: "21.025.066-6", nombre: "Catalina Vargas", email: "catalina.vargas@gmail.cl", ID_curso: 4 },
      { rut: "21.025.067-7", nombre: "Sergio Pérez", email: "sergio.perez@gmail.cl", ID_curso: 4 },
      { rut: "21.025.068-8", nombre: "Carla Romero", email: "carla.romero@gmail.cl", ID_curso: 4 },
      { rut: "21.025.069-9", nombre: "Cristian Álvarez", email: "cristian.alvarez@gmail.cl", ID_curso: 4 },
      { rut: "21.025.070-0", nombre: "Gabriela Delgado", email: "gabriela.delgado@gmail.cl", ID_curso: 4 },
      { rut: "21.025.071-1", nombre: "Alejandro Mendoza", email: "alejandro.mendoza@gmail.cl", ID_curso: 4 },
      { rut: "21.025.072-2", nombre: "Lucía Ramírez", email: "lucia.ramirez@gmail.cl", ID_curso: 4 },
      { rut: "21.025.073-3", nombre: "Rodrigo Jiménez", email: "rodrigo.jimenez@gmail.cl", ID_curso: 4 },
      { rut: "21.025.074-4", nombre: "Ana López", email: "ana.lopez@gmail.cl", ID_curso: 4 },
      { rut: "21.025.075-5", nombre: "Luis Muñoz", email: "luis.munoz@gmail.cl", ID_curso: 4 },
      { rut: "21.025.076-6", nombre: "Isabel Romero", email: "isabel.romero@gmail.cl", ID_curso: 4 },
      { rut: "21.025.077-7", nombre: "Felipe Díaz", email: "felipe.diaz1@gmail.cl", ID_curso: 4 },
      { rut: "21.025.078-8", nombre: "Verónica Silva", email: "veronica.silva@gmail.cl", ID_curso: 4 },
      { rut: "21.025.079-9", nombre: "Santiago Morales", email: "santiago.morales@gmail.cl", ID_curso: 4 },
      { rut: "21.025.080-0", nombre: "Carolina Soto", email: "carolina.soto@gmail.cl", ID_curso: 4 },
      { rut: "21.025.081-1", nombre: "Héctor González", email: "hector.gonzalez@gmail.cl", ID_curso: 5 },
      { rut: "21.025.082-2", nombre: "Paola Díaz", email: "paola.diaz@gmail.cl", ID_curso: 5 },
      { rut: "21.025.083-3", nombre: "Miguel Cortés", email: "miguel.cortes@gmail.cl", ID_curso: 5 },
      { rut: "21.025.084-4", nombre: "Andrea Rivas", email: "andrea.rivas@gmail.cl", ID_curso: 5 },
      { rut: "21.025.085-5", nombre: "Jorge Álvarez", email: "jorge.alvarez@gmail.cl", ID_curso: 5 },
      { rut: "21.025.086-6", nombre: "Patricia Soto", email: "patricia.soto@gmail.cl", ID_curso: 5 },
      { rut: "21.025.087-7", nombre: "Mario González", email: "mario.gonzalez@gmail.cl", ID_curso: 5 },
      { rut: "21.025.088-8", nombre: "Laura Pérez", email: "laura.perez@gmail.cl", ID_curso: 5 },
      { rut: "21.025.089-9", nombre: "Eduardo Fernández", email: "eduardo.fernandez@gmail.cl", ID_curso: 5 },
      { rut: "21.025.090-0", nombre: "Gabriela Medina", email: "gabriela.medina@gmail.cl", ID_curso: 5 },
      { rut: "21.025.091-1", nombre: "Ricardo Torres", email: "ricardo.torres@gmail.cl", ID_curso: 5 },
      { rut: "21.025.092-2", nombre: "Camila López", email: "camila.lopez@gmail.cl", ID_curso: 5 },
      { rut: "21.025.093-3", nombre: "Álvaro Rivas", email: "alvaro.rivas@gmail.cl", ID_curso: 5 },
      { rut: "21.025.094-4", nombre: "Mónica Salazar", email: "monica.salazar@gmail.cl", ID_curso: 5 },
      { rut: "21.025.095-5", nombre: "Javier Ramírez", email: "javier.ramirez@gmail.cl", ID_curso: 5 },
      { rut: "21.025.096-6", nombre: "Diana Morales", email: "diana.morales@gmail.cl", ID_curso: 5 },
      { rut: "21.025.097-7", nombre: "Héctor Castro", email: "hector.castro@gmail.cl", ID_curso: 5 },
      { rut: "21.025.098-8", nombre: "Valeria Pérez", email: "valeria.perez@gmail.cl", ID_curso: 5 },
      { rut: "21.025.099-9", nombre: "Luis Muñoz", email: "luis.munoz2@gmail.cl", ID_curso: 5 },
      { rut: "21.025.100-0", nombre: "Jessica Soto", email: "jessica.soto@gmail.cl", ID_curso: 5 },
      { rut: "21.025.101-1", nombre: "Sergio Medina", email: "sergio.medina@gmail.cl", ID_curso: 6 },
      { rut: "21.025.102-2", nombre: "Claudia Ramírez", email: "claudia.ramirez@gmail.cl", ID_curso: 6 },
      { rut: "21.025.103-3", nombre: "Jorge Torres", email: "jorge.torres@gmail.cl", ID_curso: 6 },
      { rut: "21.025.104-4", nombre: "Natalia Álvarez", email: "natalia.alvarez@gmail.cl", ID_curso: 6 },
      { rut: "21.025.105-5", nombre: "Francisca Silva", email: "francisca.silva@gmail.cl", ID_curso: 6 },
      { rut: "21.025.106-6", nombre: "Fernando Pérez", email: "fernando.perez@gmail.cl", ID_curso: 6 },
      { rut: "21.025.107-7", nombre: "Luis Sánchez", email: "luis.sanchez@gmail.cl", ID_curso: 6 },
      { rut: "21.025.108-8", nombre: "Camila Morales", email: "camila.morales@gmail.cl", ID_curso: 6 },
      { rut: "21.025.109-9", nombre: "Rodrigo González", email: "rodrigo.gonzalez@gmail.cl", ID_curso: 6 },
      { rut: "21.025.110-0", nombre: "Sofía López", email: "sofia.lopez@gmail.cl", ID_curso: 6 },
      { rut: "21.025.111-1", nombre: "Andrés Soto", email: "andres.soto@gmail.cl", ID_curso: 6 },
      { rut: "21.025.112-2", nombre: "Isabel Fernández", email: "isabel.fernandez1@gmail.cl", ID_curso: 6 },
      { rut: "21.025.113-3", nombre: "Samuel Ramírez", email: "samuel.ramirez@gmail.cl", ID_curso: 6 },
      { rut: "21.025.114-4", nombre: "Patricia Díaz", email: "patricia.diaz@gmail.cl", ID_curso: 6 },
      { rut: "21.025.115-5", nombre: "José Pérez", email: "jose.perez1@gmail.cl", ID_curso: 6 },
      { rut: "21.025.116-6", nombre: "Carmen González", email: "carmen.gonzalez1@gmail.cl", ID_curso: 6 },
      { rut: "21.025.117-7", nombre: "Javier Martínez", email: "javier.martinez1@gmail.cl", ID_curso: 6 },
      { rut: "21.025.118-8", nombre: "María Salazar", email: "maria.salazar1@gmail.cl", ID_curso: 6 },
      { rut: "21.025.119-9", nombre: "Daniela López", email: "daniela.lopez1@gmail.cl", ID_curso: 6 },
      { rut: "21.025.120-0", nombre: "Alejandro Cortés", email: "alejandro.cortes1@gmail.cl", ID_curso: 6 },
      { rut: "21.025.121-1", nombre: "Álvaro Álvarez", email: "alvaro.alvarez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.122-2", nombre: "Laura Ramírez", email: "laura.ramirez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.123-3", nombre: "Camila Soto", email: "camila.soto7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.124-4", nombre: "Luis González", email: "luis.gonzalez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.125-5", nombre: "Pía Fernández", email: "pia.fernandez1@gmail.cl", ID_curso: 7 },
      { rut: "21.025.126-6", nombre: "Felipe Martínez", email: "felipe.martinez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.127-7", nombre: "Mariana Ruiz", email: "mariana.ruiz7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.128-8", nombre: "Daniela Díaz", email: "daniela.diaz7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.129-9", nombre: "Ricardo Castro", email: "ricardo.castro7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.130-0", nombre: "Gabriela Moreno", email: "gabriela.moreno7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.131-1", nombre: "Héctor Gómez", email: "hector.gomez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.132-2", nombre: "Isabel Fernández", email: "isabel.fernandez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.133-3", nombre: "Ricardo González", email: "ricardo.gonzalez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.134-4", nombre: "Paola Pérez", email: "paola.perez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.135-5", nombre: "Fernando Díaz", email: "fernando.diaz7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.136-6", nombre: "Jessica Salazar", email: "jessica.salazar7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.137-7", nombre: "José López", email: "jose.lopez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.138-8", nombre: "María Morales", email: "maria.morales7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.139-9", nombre: "Álvaro Silva", email: "alvaro.silva7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.140-0", nombre: "Catalina Soto", email: "catalina.soto7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.141-1", nombre: "Santiago Álvarez", email: "santiago.alvarez@gmail.cl", ID_curso: 8 },
      { rut: "21.025.142-2", nombre: "Gabriela Cortés", email: "gabriela.cortes@gmail.cl", ID_curso: 8 },
      { rut: "21.025.143-3", nombre: "Carlos Pérez", email: "carlos.perez1@gmail.cl", ID_curso: 8 },
      { rut: "21.025.144-4", nombre: "María Gómez", email: "maria.gomez1@gmail.cl", ID_curso: 8 },
      { rut: "21.025.145-5", nombre: "Felipe Fernández", email: "felipe.fernandez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.146-6", nombre: "Laura López", email: "laura.lopez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.147-7", nombre: "Joaquín Morales", email: "joaquin.morales8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.148-8", nombre: "Natalia Soto", email: "natalia.soto8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.149-9", nombre: "Ricardo González", email: "ricardo.gonzalez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.150-0", nombre: "Alejandra Ramírez", email: "alejandra.ramirez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.151-1", nombre: "Javier Soto", email: "javier.soto8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.152-2", nombre: "Verónica Pérez", email: "veronica.perez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.153-3", nombre: "Daniela Salinas", email: "daniela.salinas8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.154-4", nombre: "Patricio Díaz", email: "patricio.diaz8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.155-5", nombre: "Simona Ramírez", email: "simona.ramirez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.156-6", nombre: "Alejandro López", email: "alejandro.lopez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.157-7", nombre: "Camila Fernández", email: "camila.fernandez@gmail.cl", ID_curso: 8 },
      { rut: "21.025.158-8", nombre: "José Soto", email: "jose.soto@gmail8.cl", ID_curso: 8 },
      { rut: "21.025.159-9", nombre: "Catalina Silva", email: "catalina.silva8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.160-0", nombre: "Nicolás González", email: "nicolas.gonzalez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.161-1", nombre: "Ricardo Ramírez", email: "ricardo.ramirez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.162-2", nombre: "Daniela Soto", email: "daniela.soto9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.163-3", nombre: "Camila Díaz", email: "camila.diaz9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.164-4", nombre: "Felipe González", email: "felipe.gonzalez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.165-5", nombre: "Laura Martínez", email: "laura.martinez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.166-6", nombre: "Jorge Pérez", email: "jorge.perez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.167-7", nombre: "Marta Fernández", email: "marta.fernandez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.168-8", nombre: "Cristian Soto", email: "cristian.soto9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.169-9", nombre: "Gabriela López", email: "gabriela.lopez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.170-0", nombre: "Javier Pérez", email: "javier1.perez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.171-1", nombre: "Natalia Ramírez", email: "natalia.ramirez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.172-2", nombre: "Álvaro Salazar", email: "alvaro.salazar9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.173-3", nombre: "María Morales", email: "maria.morales9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.174-4", nombre: "Fernando Soto", email: "fernando.soto9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.175-5", nombre: "Claudia Díaz", email: "claudia.diaz9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.176-6", nombre: "Luis Ramírez", email: "luis.ramirez19@gmail.cl", ID_curso: 9 },
      { rut: "21.025.177-7", nombre: "Paola Martínez", email: "paola.martinez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.178-8", nombre: "Simón Fernández", email: "simon.fernandez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.179-9", nombre: "Camila González", email: "camila.gonzalez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.180-0", nombre: "Valeria Soto", email: "valeria.soto9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.181-1", nombre: "Ignacio Silva", email: "ignacio.silva@gmail.cl", ID_curso: 10 },
      { rut: "21.025.182-2", nombre: "Carla Morales", email: "carla.morales@gmail.cl", ID_curso: 10 },
      { rut: "21.025.183-3", nombre: "Felipe Cortés", email: "felipe.cortes@gmail.cl", ID_curso: 10 },
      { rut: "21.025.184-4", nombre: "Ana Muñoz", email: "ana.munoz@gmail.cl", ID_curso: 10 },
      { rut: "21.025.185-5", nombre: "Sofía Soto", email: "sofia.soto@gmail.cl", ID_curso: 10 },
      { rut: "21.025.186-6", nombre: "Rodrigo Ramírez", email: "rodrigo.ramirez@gmail.cl", ID_curso: 10 },
      { rut: "21.025.187-7", nombre: "María Silva", email: "maria.silva@gmail.cl", ID_curso: 10 },
      { rut: "21.025.188-8", nombre: "José González", email: "jose.gonzalez@gmail.cl", ID_curso: 10 },
      { rut: "21.025.189-9", nombre: "Catalina Soto", email: "catalina.soto@gmail.cl", ID_curso: 10 },
      { rut: "21.025.190-0", nombre: "Juan González", email: "juan.gonzalez@gmail.cl", ID_curso: 10 },
      { rut: "21.025.191-1", nombre: "Gabriela López", email: "gabriela.lopez@gmail.cl", ID_curso: 10 },
      { rut: "21.025.192-2", nombre: "Ricardo Fernández", email: "ricardo.fernandez1@gmail.cl", ID_curso: 10 },
      { rut: "21.025.193-3", nombre: "Andrea Soto", email: "andrea.soto@gmail.cl", ID_curso: 10 },
      { rut: "21.025.194-4", nombre: "Luis Pérez", email: "luis.perez@gmail.cl", ID_curso: 10 },
      { rut: "21.025.195-5", nombre: "Natalia Silva", email: "natalia.silva@gmail.cl", ID_curso: 10 },
      { rut: "21.025.196-6", nombre: "Santiago Díaz", email: "santiago.diaz@gmail.cl", ID_curso: 10 },
      { rut: "21.025.197-7", nombre: "Pía Ramírez", email: "pia.ramirez@gmail.cl", ID_curso: 10 },
      { rut: "21.025.198-8", nombre: "Marta López", email: "marta.lopez@gmail.cl", ID_curso: 10 },
      { rut: "21.025.199-9", nombre: "Javier González", email: "javier.gonzalez@gmail.cl", ID_curso: 10 },
      { rut: "21.025.200-0", nombre: "Isabel Cortés", email: "isabel.cortes@gmail.cl", ID_curso: 10 },
      { rut: "21.025.201-1", nombre: "Daniela Pérez", email: "daniela.perez@gmail.cl", ID_curso: 11 },
      { rut: "21.025.202-2", nombre: "Jorge González", email: "jorge.gonzalez@gmail.cl", ID_curso: 11 },
      { rut: "21.025.203-3", nombre: "Ana Fernández", email: "ana.fernandez@gmail.cl", ID_curso: 11 },
      { rut: "21.025.204-4", nombre: "Ricardo Soto", email: "ricardo.soto@gmail.cl", ID_curso: 11 },
      { rut: "21.025.205-5", nombre: "Mónica Morales", email: "monica.morales@gmail.cl", ID_curso: 11 },
      { rut: "21.025.206-6", nombre: "Carlos López", email: "carlos.lopez@gmail.cl", ID_curso: 11 },
      { rut: "21.025.207-7", nombre: "Sofía Salazar", email: "sofia.salazar@gmail.cl", ID_curso: 11 },
      { rut: "21.025.208-8", nombre: "Alejandro Ramírez", email: "alejandro.ramirez@gmail.cl", ID_curso: 11 },
      { rut: "21.025.209-9", nombre: "Gabriela Ramírez", email: "gabriela.ramirez@gmail.cl", ID_curso: 11 },
      { rut: "21.025.210-0", nombre: "Pía Soto", email: "pia.soto@gmail.cl", ID_curso: 11 },
      { rut: "21.025.211-1", nombre: "Juan Álvarez", email: "juan.alvarez@gmail.cl", ID_curso: 11 },
      { rut: "21.025.212-2", nombre: "María Pérez", email: "maria.perez@gmail.cl", ID_curso: 11 },
      { rut: "21.025.213-3", nombre: "Felipe González", email: "felipe.gonzalez@gmail.cl", ID_curso: 11 },
      { rut: "21.025.214-4", nombre: "Valeria Díaz", email: "valeria.diaz@gmail.cl", ID_curso: 11 },
      { rut: "21.025.215-5", nombre: "Cristian Castro", email: "cristian.castro@gmail.cl", ID_curso: 11 },
      { rut: "21.025.216-6", nombre: "Patricia Rivas", email: "patricia.rivas@gmail.cl", ID_curso: 11 },
      { rut: "21.025.217-7", nombre: "José Salazar", email: "jose.salazar@gmail.cl", ID_curso: 11 },
      { rut: "21.025.218-8", nombre: "Natalia Morales", email: "natalia.morales@gmail.cl", ID_curso: 11 },
      { rut: "21.025.219-9", nombre: "Luis Ramírez", email: "luis.ramirez@gmail.cl", ID_curso: 11 },
      { rut: "21.025.220-0", nombre: "Mariana Díaz", email: "mariana.diaz@gmail.cl", ID_curso: 11 },
      { rut: "21.025.221-1", nombre: "Luis González", email: "luis.gonzalez@gmail.cl", ID_curso: 12 },
      { rut: "21.025.222-2", nombre: "Valeria Álvarez", email: "valeria.alvarez@gmail.cl", ID_curso: 12 },
      { rut: "21.025.223-3", nombre: "Carlos Pérez", email: "carlos.perez@gmail.cl", ID_curso: 12 },
      { rut: "21.025.224-4", nombre: "Sofía Ramírez", email: "sofia.ramirez@gmail.cl", ID_curso: 12 },
      { rut: "21.025.225-5", nombre: "Natalia Soto", email: "natalia.soto@gmail.cl", ID_curso: 12 },
      { rut: "21.025.226-6", nombre: "Ricardo Fernández", email: "ricardo.fernandez@gmail.cl", ID_curso: 12 },
      { rut: "21.025.227-7", nombre: "Gabriela Morales", email: "gabriela.morales@gmail.cl", ID_curso: 12 },
      { rut: "21.025.228-8", nombre: "José Ramírez", email: "jose.ramirez@gmail.cl", ID_curso: 12 },
      { rut: "21.025.229-9", nombre: "Ana González", email: "ana.gonzalez@gmail.cl", ID_curso: 12 },
      { rut: "21.025.230-0", nombre: "Miguel Silva", email: "miguel.silva@gmail.cl", ID_curso: 12 },
      { rut: "21.025.231-1", nombre: "Javier Soto", email: "javier.soto@gmail.cl", ID_curso: 12 },
      { rut: "21.025.232-2", nombre: "Felipe Díaz", email: "felipe.diaz@gmail.cl", ID_curso: 12 },
      { rut: "21.025.233-3", nombre: "Claudia Salinas", email: "claudia.salinas@gmail.cl", ID_curso: 12 },
      { rut: "21.025.234-4", nombre: "Joaquín Ramírez", email: "joaquin.ramirez@gmail.cl", ID_curso: 12 },
      { rut: "21.025.235-5", nombre: "Andrea Fernández", email: "andrea.fernandez@gmail.cl", ID_curso: 12 },
      { rut: "21.025.236-6", nombre: "Fernando Soto", email: "fernando.soto@gmail.cl", ID_curso: 12 },
      { rut: "21.025.237-7", nombre: "María Cortés", email: "maria.cortes@gmail.cl", ID_curso: 12 },
      { rut: "21.025.238-8", nombre: "Paola González", email: "paola.gonzalez@gmail.cl", ID_curso: 12 },
      { rut: "21.025.239-9", nombre: "José Pérez", email: "jose.perez@gmail.cl", ID_curso: 12 },
      { rut: "21.025.240-0", nombre: "Luis Salazar", email: "luis.salazar@gmail.cl", ID_curso: 12 }
    ];
    

    registrarUsuarios(alumnos, userRepository, perteneceRepository, encryptPassword);

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
