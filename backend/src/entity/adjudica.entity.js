"use strict";
import { EntitySchema } from "typeorm";

const AdjudicaSchema =  new EntitySchema({
  name: "Adjudica",
  tableName: "adjudicados",
  columns: {
    ID_curso: {
      type: "int",
      primary: true,
      nullable: false,
    },
    ID_especialidad: {
      type: "int",
      primary: true,
      nullable: false,
    },
  },
  relations: {
    ID_curso: {
      target: "Curso",
      type: "one-to-many",
      joinColumn: {
        name: "ID_curso",
        referencedColumnName: "ID_curso"
      },
    },
    ID_especialidad: {
      target: "Especialidad",
      type: "many-to-one",
      joinColumn: {
        name: "ID_especialidad",
        referencedColumnName: "ID_especialidad",
      },
    },
  },
});

export default AdjudicaSchema;