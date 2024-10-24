"use strict";
import { EntitySchema } from "typeorm";


const CursoSchema = new EntitySchema({
  name: "Curso",
  tableName: "cursos",
  columns: {
    id_Curso: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombreCurso: {
      type: "varchar",
      length: 50,
      nullable: false,
      
    },
    aula: {
        type: "varchar",
        length: 30,
        unique: true
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
  relations: { 
    usuarios:{
      target: "User",
      type: "one-to-many", // Un curso tiene muchos alumnos
      inverseSide: "curso",
    },
    imparte: {
      target: "Imparte",
      type: "one-to-many", // Un curso lo imparten muchos profesores
      inverseSide: "curso",
    },
  },
  indices: [
    {
      name: "IDX_CURSO",
      columns: ["id_Curso"],
      unique: true,
    },
  ],
});

export default CursoSchema;