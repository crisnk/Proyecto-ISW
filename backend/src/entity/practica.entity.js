"use strict";
import { EntitySchema } from "typeorm";

const PracticaSchema = new EntitySchema({
  name: "Practica", // Nombre de la entidad
  tableName: "practicas", // Nombre de la tabla en la base de datos
  columns: {
      ID_practica: {
      type: "int",
      primary: true,
      generated: true, // Valor autogenerado (autoincremental)
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    descripcion: {
      type: "varchar",
      length: 255,
      nullable: false, // no nula
    },
    cupo: {
      type: "int",
      nullable: false, // Puede no haberse completado aún
    },
    direccion: {
        type: "varchar",
        length: 255,
        nullable: false, // no nula
    },
    estado: {
        type: "varchar",
        length: 255,
        nullable: false, // no nula
    },
  },
  relations: {
    ID_especialidad: {
      type: "many-to-one", // Relación muchos a uno (muchas prácticas son realizadas por una persona)
      target: "Especialidad", // Referencia a la entidad Persona
      joinColumn: {
        name: "ID_especialidad", // Nombre del campo FK en la tabla "practicas"
        referencedColumnName: "ID_especialidad", // Referencia al campo "RUN" de la tabla "personas"
      },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});

export default PracticaSchema;
