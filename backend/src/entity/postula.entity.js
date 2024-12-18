"use strict";
import { EntitySchema } from "typeorm";

const PostulaSchema = new EntitySchema({
  name: "Postula",
  tableName: "postulaciones",
  columns: {
    ID_postulacion: {
      type: "int",
      primary: true,
      generated: true,
    },
    rut: {
      type: "varchar",
      primary: true,
      length: 12,
      nullable: false,
    },
    ID_practica: {
      type: "int",
      primary: true,
    },
    estado: {
      type: "varchar",
      length: 15,
    }
  },
  relations: {
    rut: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "rut",
        referencedColumnName: "rut"
      },
    },
    ID_practica: {
      type: "many-to-one",
      target: "Practica",
      joinColumn: {
        name: "ID_practica",
        referencedColumnName: "ID_practica"
      },
    },
  },
})

export default PostulaSchema;