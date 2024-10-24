"use strict";
import { EntitySchema } from "typeorm";


const ImparteSchema = new EntitySchema({
  name: "Imparte",
  tableName: "imparte",
  columns: {
    id_Imparte: {
      type: "int",
      primary: true,
      generated: true,
    },
    hora_inicio: {
      type: "time",
      nullable: false,
    },
    hora_Fin: {
      type: "time",
      nullable: false,
    },
    dia: { 
        type: "varchar",
      length: 50, 
      nullable: false,
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
  curso: {
      target: "Curso",
      type: "many-to-one", // Muchos registros en Imparte pueden estar asociados a un curso
      joinColumn: {
        name: "id_Curso", // Nombre de la columna FK
        referencedColumnName: "id_Curso", // Referencia la columna id en Curso
      },
      nullable: false, // Obligatoria (tiene que haber un curso)
    },
  
  materia: {
    target: "Materia",
    type: "many-to-one", // Muchas asignaciones pueden estar asociadas a una materia
    joinColumn: {
      name: "id_Materia", // Nombre de la columna FK
      referencedColumnName: "id_Materia", // Referencia la columna id en Materia
    },
    nullable: false, // Obligatoria (tiene que haber una materia)
    
  },
  profesor: {
    target: "User",
    type: "many-to-one", // Un profesor puede impartir varias materias 
    joinColumn: {
      name: "id_Profesor", // Nombre de la columna FK
      referencedColumnName: "id", // Referencia la columna id en Usuario (Profesor)
    },
    nullable: false, // Obligatoria (tiene que haber un profesor que imparte)
  },
},
  indices: [
    {
      name: "IDX_IMPARTE",
      columns: ["id_Imparte"],
      unique: true,
    },
  ],

});

export default ImparteSchema;