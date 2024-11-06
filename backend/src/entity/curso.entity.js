"use strict";
import { EntitySchema } from "typeorm";

const CursoSchema = new EntitySchema({
  name: "Curso",
  tableName: "cursos",
  columns: {
    ID_curso: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 50,
      nullable: false,

    },
    aula: {
      type: "varchar",
      length: 30,
      
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_CURSO",
      columns: ["ID_curso"],
      
    },
  ],
  relations: {
    imparten: {
      type: "one-to-many",
      target: "Imparte",
      inverseSide: "curso",
      onDelete: "CASCADE", 
    },
  },
});

export default CursoSchema;