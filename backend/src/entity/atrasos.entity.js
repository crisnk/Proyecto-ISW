"use strict";
import { EntitySchema } from "typeorm";
import UserSchema from './user.entity.js';

const AtrasoSchema = new EntitySchema({
  name: "Atraso", // Nombre de la entidad
  tableName: "atrasos", // Nombre de la tabla en la base de datos
  columns: {
    id_Atraso: {
      type: "int",
      primary: true,
      generated: true, // Generar automáticamente el ID
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    hora: {
      type: "time",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
  },
  relations: {
    RUN: {
      type: "many-to-one", // Definir la relación de muchos a uno (varios atrasos pueden ser de un solo usuario)
      target: "User", // Referencia a la entidad User
      joinColumn: {
        name: "RUN", // Nombre del campo FK en la tabla "atrasos"
        referencedColumnName: "rut" // Campo referenciado en la tabla "users"
      },
      nullable: false, // No puede ser nulo, se debe asignar siempre un usuario
      onDelete: "CASCADE", // Si se elimina un usuario, también se eliminarán los registros de atraso relacionados
    },
  },
  indices: [
    {
      name: "IDX_ATRASO_RUN",
      columns: ["RUN"],
    },
  ],
});

export default AtrasoSchema;