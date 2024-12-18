"use strict";
import { EntitySchema } from "typeorm";

const PerteneceSchema = new EntitySchema({
  name: "Pertenece",
  tableName: "pertenecen",
  columns: {
    ID_pertenece: {
      type: "int",
      primary: true,
      generated: true,
    },
    ID_curso: {
      type: "int",
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 12,
      nullable: true,
    },
    año: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    user: { 
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "rut",
        referencedColumnName: "rut",
      },
      nullable: false,
    },
    curso: {
      type: "many-to-one",
      target: "Curso",
      joinColumn: {
        name: "ID_curso",
        referencedColumnName: "ID_curso",
      },
      nullable: false,
    },
  },
});

export default PerteneceSchema;
