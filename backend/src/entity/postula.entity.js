"use strict";
import { EntitySchema } from "typeorm";


const PostulaSchema = new EntitySchema({
  name: "Postula",
  tableName: "postulaciones",
  columns: {
    RUN: {
      type: "varchar",
      primaryKey: true,
      length: 12,
      nullable: false,
      unique: true,
    },
    ID_practica: {
      type: "int",
      primary: true,
      generated: true, // Valor autogenerado (autoincremental)
    },
  },
  relations: {
    RUN: {
      type: "many-to-many",
      target: "User",
      joinColumn: {
        name: "RUN",
        referencedColumnName: "RUN"
      },
      nullable: false, // No puede ser nulo, se debe asignar siempre un usuario
    },
    ID_practica: {
      type: "many-to-many",
      target: "Practica",
      joinColumn: {
        name: "ID_practica",
        referencedColumnName: "ID_practica"
      },
    },
  },
})

export default PostulaSchema;