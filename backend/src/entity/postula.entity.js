"use strict";
import { EntitySchema } from "typeorm";


const PostulaSchema = new EntitySchema({
  name: "Postula",
  tableName: "postulaciones",
  columns: {
    rut: {
      type: "varchar",
      primaryKey: true,
      length: 12,
      nullable: false,
      unique: true,
    },
    ID_practica: {
      type: "int",
      primary: true,
    },
  },
  relations: {
    rut: {
      type: "many-to-many",
      target: "User",
      joinColumn: {
        name: "rut",
        referencedColumnName: "rut"
      },
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