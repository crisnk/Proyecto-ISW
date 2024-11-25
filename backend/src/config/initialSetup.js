"use strict";
import User from "../entity/user.entity.js";
import Especialidad from "../entity/especialidad.entity.js";
import Pertenece from "../entity/pertenece.entity.js";
import Curso from "../entity/curso.entity.js";
import Materia from "../entity/materia.entity.js";
import Imparte from "../entity/imparte.entity.js";

import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import { In } from 'typeorm';

export async function crearProfesores(){
  try{

    const userRepository = AppDataSource.getRepository(User);
    const count = await userRepository.count({
      where: {
        rol: 'profesor'  
      }
    });
    if (count > 0) return;   

    const profesores = [
      { rut: "12.345.678-9", nombre: "María Fernanda López Araya", email: "maria.fernanda@liceo.cl" },
      { rut: "11.234.567-8", nombre: "Juan Ignacio Pérez Morales", email: "juan.ignacio@liceo.cl" },
      { rut: "10.123.456-7", nombre: "Ana Sofía Ramírez Díaz", email: "ana.sofia@liceo.cl" },
      { rut: "9.012.345-6", nombre: "Carlos Andrés Salinas Soto", email: "carlos.andres@liceo.cl" },
      { rut: "8.901.234-5", nombre: "Fernanda Isabel González Rojas", email: "fernanda.isabel@liceo.cl" },
      { rut: "7.890.123-4", nombre: "Luis Felipe Morales Álvarez", email: "luis.felipe@liceo.cl" },
      { rut: "6.789.012-3", nombre: "Javiera Alejandra Castro Fuentes", email: "javiera.alejandra@liceo.cl" },
      { rut: "5.678.901-2", nombre: "Ricardo Esteban Silva Vergara", email: "ricardo.esteban@liceo.cl" },
      { rut: "4.567.890-1", nombre: "Patricia Carolina Díaz Salazar", email: "patricia.carolina@liceo.cl" },
      { rut: "3.456.789-0", nombre: "José Manuel Rivas Cortés", email: "jose.manuel@liceo.cl" },
      { rut: "2.345.678-9", nombre: "Sofía Antonia Álvarez Muñoz", email: "sofia.antonia@liceo.cl" },
      { rut: "1.234.567-8", nombre: "Joaquín Emilio Soto Ramírez", email: "joaquin.emilio@liceo.cl" }
    ];

    for (const profesor of profesores) {
      await userRepository.save(
        userRepository.create({
          nombreCompleto: profesor.nombre,
          rut: profesor.rut,
          email: profesor.email,
          rol: "profesor",
          password: await encryptPassword("profesor1234"),
        })
      );
    }  

  }catch(error){
    console.error("Error al crear profesores:", error);
  }
}

export async function crearCursos() {
  try {
    const cursoRepository = AppDataSource.getRepository(Curso);

    const count = await cursoRepository.count();
    if (count > 0) return;

    const cursos = [
      { nombre: "1ro Medio A", aula: "Sala 1",profesor: "12.345.678-9"},
      { nombre: "1ro Medio B", aula: "Sala 2",profesor: "11.234.567-8"},
      { nombre: "1ro Medio C", aula: "Sala 3",profesor: "10.123.456-7"},
      { nombre: "2do Medio A", aula: "Sala 4",profesor: "9.012.345-6"},
      { nombre: "2do Medio B", aula: "Sala 5",profesor: "8.901.234-5"},
      { nombre: "2do Medio C", aula: "Sala 6",profesor: "7.890.123-4"},
      { nombre: "3ro Medio A", aula: "Sala 7",profesor: "6.789.012-3"},
      { nombre: "3ro Medio B", aula: "Sala 8",profesor: "5.678.901-2"},
      { nombre: "3ro Medio C", aula: "Sala 9",profesor: "4.567.890-1"},
      { nombre: "4to Medio A", aula: "Sala 10",profesor: "3.456.789-0"},
      { nombre: "4to Medio B", aula: "Sala 11",profesor: "2.345.678-9"},
      { nombre: "4to Medio C", aula: "Sala 12",profesor: "1.234.567-8"},
    ];

    for (const { nombre, aula, profesor } of cursos) {
      const cursoExistente = await cursoRepository.findOneBy({ nombre });
      if (!cursoExistente) {
        const nuevoCurso = cursoRepository.create({ nombre, aula, profesor });
        await cursoRepository.save(nuevoCurso);
      } else {
        console.log("Curso ya creado")
      }
    }
  } catch (error) {
    console.error("Error al crear cursos ", error);    
  }
}

export async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const perteneceRepository = AppDataSource.getRepository(Pertenece);

    const count = await userRepository.count({
      where: {
        rol: In(['administrador', 'jefeUTP', 'EDP', 'alumno'])
      }
    });
    if (count > 0) return;
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
          rut: "12.345.008-9",          
          email: "jefeutp@gmail.cl",          
          password: await encryptPassword("jefeutp1234"),
          rol: "jefeUTP",
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
    ]);

    const alumnos = [
      { rut: "19.741.384-0", nombre: "Dilan Alejandro Aranguiz Vejar", email: "dilan.aranguiz2201@alumnos.ubiobio.cl", ID_curso: 1 },
      { rut: "21.237.487-3", nombre: "Esteban Patricio Bravo Suárez", email: "esteban.bravo2101@alumnos.ubiobio.cl.cl", ID_curso: 1 },
      { rut: "11.111.111-9", nombre: "Cristobal Alarcon", email: "cristobal.alarcon2101@alumnos.ubiobio.cl", ID_curso: 1 },
      { rut: "21.012.009-2", nombre: "Diego Antonio Vargas Gómez", email: "diego.vargas2001@alumnos.ubiobio.cl", ID_curso: 1 },
      { rut: "21.025.001-1", nombre: "Juan Carlos Silva Pérez", email: "juan.carlos.silva.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.002-2", nombre: "Ana María Gómez Torres", email: "ana.maria.gomez.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.003-3", nombre: "Pedro Luis Morales Díaz", email: "pedro.luis.morales.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.004-4", nombre: "María Isabel López Fuentes", email: "maria.isabel.lopez.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.005-5", nombre: "Luis Eduardo Fernández Soto", email: "luis.eduardo.fernandez.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.006-6", nombre: "Sofía Alejandra Ramírez Gómez", email: "sofia.alejandra.ramirez.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.007-7", nombre: "Daniela Patricia Ruiz Vargas", email: "daniela.patricia.ruiz.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.008-8", nombre: "Carlos Andrés Jiménez Ramírez", email: "carlos.andres.jimenez.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.009-9", nombre: "Laura Beatriz Martínez Soto", email: "laura.beatriz.martinez.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.010-0", nombre: "Javier Ernesto Pérez Molina", email: "javier.ernesto.perez.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.011-1", nombre: "Gabriela Soledad Sánchez Torres", email: "gabriela.soledad.sanchez.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.012-2", nombre: "Francisco Javier Castro Fernández", email: "francisco.javier.castro.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.013-3", nombre: "Valentina Carolina Soto González", email: "valentina.carolina.soto.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.014-4", nombre: "Andrés Felipe Morales Jiménez", email: "andres.felipe.morales.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.015-5", nombre: "Catalina Isabel Salazar Vargas", email: "catalina.isabel.salazar.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.017-7", nombre: "Camila Fernanda González Díaz", email: "camila.fernanda.gonzalez.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.018-8", nombre: "Nicolás Antonio Paredes López", email: "nicolas.antonio.paredes.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.019-9", nombre: "Isabel Mariana Torres Jiménez", email: "isabel.mariana.torres.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.020-0", nombre: "Ricardo Emilio Molina Soto", email: "ricardo.emilio.molina.1@gmail.cl", ID_curso: 1 },
      { rut: "21.025.021-1", nombre: "Fernando José Castillo Morales", email: "fernando.jose.castillo.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.022-2", nombre: "Marta Lucía Medina Ruiz", email: "marta.lucia.medina.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.023-3", nombre: "Alejandro Iván Pérez López", email: "alejandro.ivan.perez.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.024-4", nombre: "Carmen Beatriz Soto Morales", email: "carmen.beatriz.soto.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.025-5", nombre: "Cristian Eduardo Ruiz Torres", email: "cristian.eduardo.ruiz.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.026-6", nombre: "Juliana Andrea García Martínez", email: "juliana.andrea.garcia.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.027-7", nombre: "Héctor Luis Mendoza Fuentes", email: "hector.luis.mendoza.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.028-8", nombre: "Natalia Rosario Herrera Díaz", email: "natalia.rosario.herrera.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.029-9", nombre: "Guillermo Alfonso Díaz Vargas", email: "guillermo.alfonso.diaz.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.030-0", nombre: "Ángela María Rivas Fernández", email: "angela.maria.rivas.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.031-1", nombre: "Simón Ernesto López Ramírez", email: "simon.ernesto.lopez.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.032-2", nombre: "Carolina Isabel Vargas Salazar", email: "carolina.isabel.vargas.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.033-3", nombre: "Mauricio Andrés Ruiz Molina", email: "mauricio.andres.ruiz.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.034-4", nombre: "Ana María Ramírez Cortés", email: "ana.maria.ramirez.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.035-5", nombre: "Ricardo Alejandro Romero Paredes", email: "ricardo.alejandro.romero.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.036-6", nombre: "Paola Fernanda García Torres", email: "paola.fernanda.garcia.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.037-7", nombre: "Oscar Emilio Moreno Díaz", email: "oscar.emilio.moreno.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.038-8", nombre: "Lucía Teresa González Vargas", email: "lucia.teresa.gonzalez.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.039-9", nombre: "Mauricio Rafael Silva Fernández", email: "mauricio.rafael.silva.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.040-0", nombre: "Sara Verónica Molina López", email: "sara.veronica.molina.2@gmail.cl", ID_curso: 2 },
      { rut: "21.025.041-1", nombre: "Joaquín Andrés Salinas Pérez", email: "joaquin.salinas.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.042-2", nombre: "Felipe Antonio Fernández Rojas", email: "felipe.fernandez.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.043-3", nombre: "Marcela Andrea Soto Rivera", email: "marcela.soto.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.044-4", nombre: "Valeria Isabel Vargas López", email: "valeria.vargas.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.045-5", nombre: "Rodrigo Emilio Moreno Castro", email: "rodrigo.moreno.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.046-6", nombre: "Sofía Natalia Arias Díaz", email: "sofia.arias.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.047-7", nombre: "Javier Esteban Cortés Guzmán", email: "javier.cortes.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.048-8", nombre: "Daniel Enrique Salazar Fuentes", email: "daniel.salazar.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.049-9", nombre: "Andrea Sofía Díaz Fernández", email: "andrea.diaz.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.050-0", nombre: "Samuel Ignacio Soto Ortega", email: "samuel.soto.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.051-1", nombre: "Mariana Alejandra González Peña", email: "mariana.gonzalez.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.052-2", nombre: "Eduardo Tomás Ramírez Vargas", email: "eduardo.ramirez.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.053-3", nombre: "Gabriel Emilio Romero Cáceres", email: "gabriel.romero.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.054-4", nombre: "Catherine Beatriz Morales Ulloa", email: "catherine.morales.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.055-5", nombre: "Julio Andrés Rodríguez Campos", email: "julio.rodriguez.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.056-6", nombre: "Cristina Pamela Medina Pino", email: "cristina.medina.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.057-7", nombre: "Marta Susana Herrera Lagos", email: "marta.herrera.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.058-8", nombre: "Hugo Ignacio Delgado Vera", email: "hugo.delgado.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.059-9", nombre: "Laura Valentina Álvarez Ruiz", email: "laura.alvarez.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.060-0", nombre: "David Enrique Paredes Soto", email: "david.paredes.3@gmail.cl", ID_curso: 3 },
      { rut: "21.025.061-1", nombre: "José Miguel Martínez Torres", email: "jose.martinez.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.062-2", nombre: "Mariana Isabel Hernández Vargas", email: "mariana.hernandez.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.063-3", nombre: "Daniel Antonio Díaz Aravena", email: "daniel.diaz.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.064-4", nombre: "Natalia Pamela Fernández Reyes", email: "natalia.fernandez.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.065-5", nombre: "Francisco Javier Cortés Zúñiga", email: "francisco.cortes.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.066-6", nombre: "Catalina Alejandra Vargas Guzmán", email: "catalina.vargas.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.067-7", nombre: "Sergio Andrés Pérez Contreras", email: "sergio.perez.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.068-8", nombre: "Carla Antonia Romero Muñoz", email: "carla.romero.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.069-9", nombre: "Cristian Emilio Álvarez Sepúlveda", email: "cristian.alvarez.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.070-0", nombre: "Gabriela Susana Delgado Marín", email: "gabriela.delgado.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.071-1", nombre: "Alejandro Javier Mendoza Soto", email: "alejandro.mendoza.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.072-2", nombre: "Lucía Beatriz Ramírez Escobar", email: "lucia.ramirez.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.073-3", nombre: "Rodrigo Andrés Jiménez Torres", email: "rodrigo.jimenez.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.074-4", nombre: "Ana María López Rojas", email: "ana.lopez.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.075-5", nombre: "Luis Enrique Muñoz Vergara", email: "luis.munoz.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.076-6", nombre: "Isabel Cecilia Romero Soto", email: "isabel.romero.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.077-7", nombre: "Felipe Ignacio Díaz Cornejo", email: "felipe.diaz.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.078-8", nombre: "Verónica Alejandra Silva Campos", email: "veronica.silva.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.079-9", nombre: "Santiago Andrés Morales Fuentes", email: "santiago.morales.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.080-0", nombre: "Carolina Beatriz Soto Ulloa", email: "carolina.soto.4@gmail.cl", ID_curso: 4 },
      { rut: "21.025.081-1", nombre: "Héctor Tomás González Pérez", email: "hector.gonzalez.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.082-2", nombre: "Paola Andrea Díaz Rojas", email: "paola.diaz.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.083-3", nombre: "Miguel Ángel Cortés López", email: "miguel.cortes.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.084-4", nombre: "Andrea Fernanda Rivas Castillo", email: "andrea.rivas.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.085-5", nombre: "Jorge Luis Álvarez Morales", email: "jorge.alvarez.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.086-6", nombre: "Patricia Soledad Soto Peña", email: "patricia.soto.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.087-7", nombre: "Mario Esteban González Saavedra", email: "mario.gonzalez.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.088-8", nombre: "Laura Marcela Pérez Vargas", email: "laura.perez.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.089-9", nombre: "Eduardo Javier Fernández León", email: "eduardo.fernandez.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.090-0", nombre: "Gabriela Carolina Medina Flores", email: "gabriela.medina.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.091-1", nombre: "Ricardo Antonio Torres Reyes", email: "ricardo.torres.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.092-2", nombre: "Camila Francisca López Ruiz", email: "camila.lopez.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.093-3", nombre: "Álvaro Ignacio Rivas Méndez", email: "alvaro.rivas.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.094-4", nombre: "Mónica Isabel Salazar Pizarro", email: "monica.salazar.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.095-5", nombre: "Javier Rodrigo Ramírez Soto", email: "javier.ramirez.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.096-6", nombre: "Diana Patricia Morales Vergara", email: "diana.morales.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.097-7", nombre: "Héctor Ricardo Castro Silva", email: "hector.castro.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.098-8", nombre: "Valeria Fernanda Pérez Orellana", email: "valeria.perez.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.099-9", nombre: "Luis Felipe Muñoz Gutiérrez", email: "luis.munoz.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.100-0", nombre: "Jessica Alejandra Soto Varela", email: "jessica.soto.5@gmail.cl", ID_curso: 5 },
      { rut: "21.025.101-1", nombre: "Sergio Martín Medina Salinas", email: "sergio.medina.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.102-2", nombre: "Claudia Isabel Ramírez Cáceres", email: "claudia.ramirez.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.103-3", nombre: "Jorge Mauricio Torres Fuentes", email: "jorge.torres.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.104-4", nombre: "Natalia Fernanda Álvarez Carvajal", email: "natalia.alvarez.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.105-5", nombre: "Francisca Beatriz Silva Díaz", email: "francisca.silva.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.106-6", nombre: "Fernando Eduardo Pérez Gómez", email: "fernando.perez.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.107-7", nombre: "Luis Alberto Sánchez Paredes", email: "luis.sanchez.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.108-8", nombre: "Camila Rosario Morales Campos", email: "camila.morales.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.109-9", nombre: "Rodrigo Andrés González Reyes", email: "rodrigo.gonzalez.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.110-0", nombre: "Sofía Valentina López Bustos", email: "sofia.lopez.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.111-1", nombre: "Andrés Esteban Soto Lagos", email: "andres.soto.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.112-2", nombre: "Isabel Mariana Fernández Tapia", email: "isabel.fernandez.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.113-3", nombre: "Samuel Ignacio Ramírez Espinoza", email: "samuel.ramirez.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.114-4", nombre: "Patricia Carolina Díaz Lagos", email: "patricia.diaz.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.115-5", nombre: "José Daniel Pérez Quintana", email: "jose.perez.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.116-6", nombre: "Carmen Angélica González Valdés", email: "carmen.gonzalez.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.117-7", nombre: "Javier Alfonso Martínez Ibarra", email: "javier.martinez.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.118-8", nombre: "María Teresa Salazar Campos", email: "maria.salazar.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.119-9", nombre: "Daniela Rocío López Navarro", email: "daniela.lopez.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.120-0", nombre: "Alejandro Emilio Cortés Sandoval", email: "alejandro.cortes.6@gmail.cl", ID_curso: 6 },
      { rut: "21.025.121-1", nombre: "Álvaro Ignacio Álvarez Ortiz", email: "alvaro.ignacio.alvarez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.122-2", nombre: "Laura Isabel Ramírez Toledo", email: "laura.isabel.ramirez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.123-3", nombre: "Camila Fernanda Soto Morales", email: "camila.fernanda.soto7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.124-4", nombre: "Luis Eduardo González Paredes", email: "luis.eduardo.gonzalez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.125-5", nombre: "Pía Alejandra Fernández Ríos", email: "pia.alejandra.fernandez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.126-6", nombre: "Felipe Andrés Martínez Castillo", email: "felipe.andres.martinez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.127-7", nombre: "Mariana Valentina Ruiz Cáceres", email: "mariana.valentina.ruiz7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.128-8", nombre: "Daniela Carolina Díaz Fuentes", email: "daniela.carolina.diaz7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.129-9", nombre: "Ricardo Patricio Castro Peña", email: "ricardo.patricio.castro7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.130-0", nombre: "Gabriela Antonia Moreno Vargas", email: "gabriela.antonia.moreno7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.131-1", nombre: "Héctor Manuel Gómez Sáez", email: "hector.manuel.gomez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.132-2", nombre: "Isabel Marcela Fernández Alarcón", email: "isabel.marcela.fernandez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.133-3", nombre: "Ricardo Emilio González Bravo", email: "ricardo.emilio.gonzalez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.134-4", nombre: "Paola Andrea Pérez Godoy", email: "paola.andrea.perez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.135-5", nombre: "Fernando Tomás Díaz Ramírez", email: "fernando.tomas.diaz7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.136-6", nombre: "Jessica Francisca Salazar Figueroa", email: "jessica.francisca.salazar7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.137-7", nombre: "José Ignacio López Ávila", email: "jose.ignacio.lopez7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.138-8", nombre: "María Paz Morales Orellana", email: "maria.paz.morales7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.139-9", nombre: "Álvaro Sebastián Silva Ortega", email: "alvaro.sebastian.silva7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.140-0", nombre: "Catalina Teresa Soto Muñoz", email: "catalina.teresa.soto7@gmail.cl", ID_curso: 7 },
      { rut: "21.025.141-1", nombre: "Santiago Enrique Álvarez Guzmán", email: "santiago.enrique.alvarez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.142-2", nombre: "Gabriela Constanza Cortés Jara", email: "gabriela.constanza.cortes8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.143-3", nombre: "Carlos Ernesto Pérez Vergara", email: "carlos.ernesto.perez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.144-4", nombre: "María Soledad Gómez Aguilera", email: "maria.soledad.gomez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.145-5", nombre: "Felipe Rodrigo Fernández Núñez", email: "felipe.rodrigo.fernandez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.146-6", nombre: "Laura Emilia López Aravena", email: "laura.emilia.lopez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.147-7", nombre: "Joaquín Vicente Morales Pizarro", email: "joaquin.vicente.morales8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.148-8", nombre: "Natalia Angélica Soto Valdés", email: "natalia.angelica.soto8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.149-9", nombre: "Ricardo Antonio González Sepúlveda", email: "ricardo.antonio.gonzalez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.150-0", nombre: "Alejandra Daniela Ramírez Durán", email: "alejandra.daniela.ramirez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.151-1", nombre: "Javier Nicolás Soto Acevedo", email: "javier.nicolas.soto8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.152-2", nombre: "Verónica Pamela Pérez Marín", email: "veronica.pamela.perez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.153-3", nombre: "Daniela Elizabeth Salinas Ovalle", email: "daniela.elizabeth.salinas8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.154-4", nombre: "Patricio Javier Díaz Concha", email: "patricio.javier.diaz8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.155-5", nombre: "Simona Andrea Ramírez Morales", email: "simona.andrea.ramirez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.156-6", nombre: "Alejandro Francisco López Cifuentes", email: "alejandro.francisco.lopez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.157-7", nombre: "Camila Fernanda Fernández Guzmán", email: "camila.fernanda.fernandez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.158-8", nombre: "José Pedro Soto Correa", email: "jose.pedro.soto8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.159-9", nombre: "Catalina Rosario Silva Hernández", email: "catalina.rosario.silva8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.160-0", nombre: "Nicolás Mauricio González Vergara", email: "nicolas.mauricio.gonzalez8@gmail.cl", ID_curso: 8 },
      { rut: "21.025.161-1", nombre: "Ricardo Antonio Ramírez Fuentes", email: "ricardo.ramirez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.162-2", nombre: "Daniela Sofía Soto Carrasco", email: "daniela.soto9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.163-3", nombre: "Camila Fernanda Díaz Rojas", email: "camila.diaz9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.164-4", nombre: "Felipe Alejandro González Morales", email: "felipe.gonzalez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.165-5", nombre: "Laura Carolina Martínez Vega", email: "laura.martinez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.166-6", nombre: "Jorge Andrés Pérez Salinas", email: "jorge.perez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.167-7", nombre: "Marta Isabel Fernández Campos", email: "marta.fernandez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.168-8", nombre: "Cristian Alberto Soto Lagos", email: "cristian.soto9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.169-9", nombre: "Gabriela Beatriz López Cáceres", email: "gabriela.lopez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.170-0", nombre: "Javier Rodrigo Pérez Varela", email: "javier.perez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.171-1", nombre: "Natalia Eugenia Ramírez Torres", email: "natalia.ramirez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.172-2", nombre: "Álvaro Ignacio Salazar Muñoz", email: "alvaro.salazar9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.173-3", nombre: "María Teresa Morales Figueroa", email: "maria.morales9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.174-4", nombre: "Fernando Enrique Soto Vidal", email: "fernando.soto9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.175-5", nombre: "Claudia Patricia Díaz Castro", email: "claudia.diaz9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.176-6", nombre: "Luis Ricardo Ramírez Paredes", email: "luis.ramirez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.177-7", nombre: "Paola Andrea Martínez Silva", email: "paola.martinez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.178-8", nombre: "Simón Esteban Fernández Rivas", email: "simon.fernandez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.179-9", nombre: "Camila Javiera González Pino", email: "camila.gonzalez9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.180-0", nombre: "Valeria Lorena Soto Rivera", email: "valeria.soto9@gmail.cl", ID_curso: 9 },
      { rut: "21.025.181-1", nombre: "Ignacio Andrés Silva Fuentes", email: "ignacio.silva10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.182-2", nombre: "Carla Sofía Morales Rojas", email: "carla.morales10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.183-3", nombre: "Felipe Alejandro Cortés Vega", email: "felipe.cortes10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.184-4", nombre: "Ana María Muñoz Salinas", email: "ana.munoz10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.185-5", nombre: "Sofía Carolina Soto Torres", email: "sofia.soto10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.186-6", nombre: "Rodrigo Alberto Ramírez Castro", email: "rodrigo.ramirez10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.187-7", nombre: "María Teresa Silva Carrasco", email: "maria.silva10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.188-8", nombre: "José Antonio González Morales", email: "jose.gonzalez10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.189-9", nombre: "Catalina Fernanda Soto Varela", email: "catalina.soto10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.190-0", nombre: "Juan Esteban González Pino", email: "juan.gonzalez10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.191-1", nombre: "Gabriela Beatriz López Vidal", email: "gabriela.lopez10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.192-2", nombre: "Ricardo Ignacio Fernández Figueroa", email: "ricardo.fernandez10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.193-3", nombre: "Andrea Patricia Soto Castro", email: "andrea.soto10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.194-4", nombre: "Luis Alberto Pérez Rivas", email: "luis.perez10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.195-5", nombre: "Natalia Eugenia Silva Paredes", email: "natalia.silva10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.196-6", nombre: "Santiago Enrique Díaz Rojas", email: "santiago.diaz10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.197-7", nombre: "Pía Isabel Ramírez Cáceres", email: "pia.ramirez10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.198-8", nombre: "Marta Carolina López Vega", email: "marta.lopez10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.199-9", nombre: "Javier Rodrigo González Lagos", email: "javier.gonzalez10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.200-0", nombre: "Isabel Lorena Cortés Salinas", email: "isabel.cortes10@gmail.cl", ID_curso: 10 },
      { rut: "21.025.201-1", nombre: "Daniela Andrea Pérez Morales", email: "daniela.perez.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.202-2", nombre: "Jorge Alejandro González Soto", email: "jorge.gonzalez.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.203-3", nombre: "Ana Isabel Fernández Rivas", email: "ana.fernandez.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.204-4", nombre: "Ricardo Andrés Soto Álvarez", email: "ricardo.soto.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.205-5", nombre: "Mónica Elena Morales Díaz", email: "monica.morales.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.206-6", nombre: "Carlos Eduardo López Castro", email: "carlos.lopez.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.207-7", nombre: "Sofía Alejandra Salazar Ríos", email: "sofia.salazar.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.208-8", nombre: "Alejandro Manuel Ramírez Ortega", email: "alejandro.ramirez.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.209-9", nombre: "Gabriela Verónica Ramírez Pérez", email: "gabriela.ramirez.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.210-0", nombre: "Pía Antonia Soto Fernández", email: "pia.soto.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.211-1", nombre: "Juan Francisco Álvarez Salinas", email: "juan.alvarez.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.212-2", nombre: "María Victoria Pérez Ramírez", email: "maria.perez.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.213-3", nombre: "Felipe Javier González Álvarez", email: "felipe.gonzalez.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.214-4", nombre: "Valeria Marcela Díaz López", email: "valeria.diaz.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.215-5", nombre: "Cristian Antonio Castro Morales", email: "cristian.castro.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.216-6", nombre: "Patricia Carolina Rivas Muñoz", email: "patricia.rivas.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.217-7", nombre: "José Miguel Salazar Fernández", email: "jose.salazar.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.218-8", nombre: "Natalia Fernanda Morales Gutiérrez", email: "natalia.morales.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.219-9", nombre: "Luis Sebastián Ramírez Soto", email: "luis.ramirez.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.220-0", nombre: "Mariana Alejandra Díaz Guzmán", email: "mariana.diaz.11@gmail.cl", ID_curso: 11 },
      { rut: "21.025.221-1", nombre: "Luis Fernando González Ortega", email: "luis.gonzalez.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.222-2", nombre: "Valeria Isabel Álvarez López", email: "valeria.alvarez.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.223-3", nombre: "Carlos Andrés Pérez Rivas", email: "carlos.perez.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.224-4", nombre: "Sofía Magdalena Ramírez Díaz", email: "sofia.ramirez.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.225-5", nombre: "Natalia Andrea Soto Fernández", email: "natalia.soto.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.226-6", nombre: "Ricardo Arturo Fernández Salinas", email: "ricardo.fernandez.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.227-7", nombre: "Gabriela Teresa Morales Guzmán", email: "gabriela.morales.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.228-8", nombre: "José Raúl Ramírez González", email: "jose.ramirez.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.229-9", nombre: "Ana Victoria González Díaz", email: "ana.gonzalez.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.230-0", nombre: "Miguel Alejandro Silva Soto", email: "miguel.silva.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.231-1", nombre: "Javier Daniel Soto Fernández", email: "javier.soto.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.232-2", nombre: "Felipe Ignacio Díaz Morales", email: "felipe.diaz.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.233-3", nombre: "Claudia Soledad Salinas Ramírez", email: "claudia.salinas.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.234-4", nombre: "Joaquín Esteban Ramírez Guzmán", email: "joaquin.ramirez.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.235-5", nombre: "Andrea Beatriz Fernández López", email: "andrea.fernandez.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.236-6", nombre: "Fernando Augusto Soto Álvarez", email: "fernando.soto.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.237-7", nombre: "María Cristina Cortés Morales", email: "maria.cortes.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.238-8", nombre: "Paola Elena González Rivas", email: "paola.gonzalez.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.239-9", nombre: "José Alberto Pérez Díaz", email: "jose.perez.12@gmail.cl", ID_curso: 12 },
      { rut: "21.025.240-0", nombre: "Luis Eduardo Salazar Fernández", email: "luis.salazar.12@gmail.cl", ID_curso: 12 }
    ];

    for (const alumno of alumnos) {
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

export async function crearMaterias() {
  try {
    const materiaRepository = AppDataSource.getRepository(Materia);
    const count = await materiaRepository.count();
    if (count > 0) return;

    const materias = [
      "Matemáticas",
      "Historia",
      "Lenguaje",
      "Biología",
      "Química",
      "Inglés",
      "Artes",
      "Física",
      "Educación Física",
      "Tecnología",
      "Mecánica I",
      "Electricidad I",
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

export async function crearImparticiones() {
  try {
    const imparteRepository = AppDataSource.getRepository(Imparte);
    const count = await imparteRepository.count();
    if (count > 0) return;  
    const imparticiones = [
      { ID_curso: 1, ID_materia: 1, rut: "12.345.678-9", dia: "lunes", bloque: "08:00 - 08:45", hora_Inicio: "08:00", hora_Fin: "08:45" },
      { ID_curso: 1, ID_materia: 2, rut: "11.234.567-8", dia: "lunes", bloque: "08:50 - 09:35", hora_Inicio: "08:50", hora_Fin: "09:35" },
      { ID_curso: 1, ID_materia: 3, rut: "10.123.456-7", dia: "lunes", bloque: "09:40 - 10:25", hora_Inicio: "09:40", hora_Fin: "10:25" },
      { ID_curso: 1, ID_materia: 4, rut: "9.012.345-6", dia: "lunes", bloque: "11:20 - 12:05", hora_Inicio: "11:20", hora_Fin: "12:05" },
      { ID_curso: 1, ID_materia: 5, rut: "8.901.234-5", dia: "lunes", bloque: "12:10 - 12:55", hora_Inicio: "12:10", hora_Fin: "12:55" },
      { ID_curso: 1, ID_materia: 6, rut: "7.890.123-4", dia: "lunes", bloque: "14:30 - 15:15", hora_Inicio: "14:30", hora_Fin: "15:15" },
      { ID_curso: 1, ID_materia: 7, rut: "6.789.012-3", dia: "lunes", bloque: "15:20 - 16:05", hora_Inicio: "15:20", hora_Fin: "16:05" },
      { ID_curso: 1, ID_materia: 8, rut: "5.678.901-2", dia: "lunes", bloque: "16:10 - 16:55", hora_Inicio: "16:10", hora_Fin: "16:55" },
      { ID_curso: 1, ID_materia: 9, rut: "4.567.890-1", dia: "lunes", bloque: "17:00 - 17:45", hora_Inicio: "17:00", hora_Fin: "17:45" }  
    ];
    
    await imparteRepository.save(imparticiones);
  
  } catch (error) {
    console.error("Error al crear materias predeterminadas:", error);
  }
}

