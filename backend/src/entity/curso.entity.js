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
    persona:{
      type: "one-to-one", // Un curso tiene muchos alumnos
      target: "persona",
      joinColumn: {
        name: "RUN", 
        referencedColumnName: "RUN" 
      },
      nullable: false, 
      onDelete: "CASCADE", 
    },
  },
  indices: [
    {
      name: "IDX_CURSO",
      columns: ["ID_curso"],
      unique: true,
    },
  ],
});

export default CursoSchema;