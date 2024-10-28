"use strict";
import { EntitySchema } from "typeorm";

const PertenceSchema = new EntitySchema({
  name: "Pertenece",
  tableName: "pertenecen",
  columns: {
    rut: {
      type: "varchar",
      primaryKey: true,
      length: 12,
      nullable: false,
      unique: true,
    },
    ID_curso: {
      type: "int",
      primary: true,
      generated: true,
    },
  },
  relations: {
    rut: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "rut",
        referencedColumnName: "rut"
      },
      nullable: false, 
    },
    ID_Curso: {
      type: "many-to-one",
      target: "Curso",
      joinColumn: {
        name: "ID_curso",
        referencedColumnName: "ID_curso"
      },
    },
  },
})

export default PertenceSchema;