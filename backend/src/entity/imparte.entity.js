"use strict";
import { EntitySchema } from "typeorm";

const ImparteSchema = new EntitySchema({
  name: "Imparte",
  tableName: "imparten",
  columns: {
    ID_materia: {
      type: "int",
      primary: true,
    },
    ID_curso: {
      type: "int",
      primary: true,
    },
    rut: {
      type: "int",
      primary: true,
    },
    dia: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    hora_inicio: {
      type: "time",
      nullable: false,
    },
    hora_Fin: {
      type: "time",
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
      type: "many-to-many", // Muchos registros en Imparte pueden estar asociados a un curso
      joinColumn: {
        name: "ID_curso", // Nombre de la columna FK
        referencedColumnName: "ID_curso", // Referencia la columna id en Curso
      },
      nullable: false, // Obligatoria (tiene que haber un curso)
    },

    materia: {
      target: "Materia",
      type: "many-to-many", // Muchas asignaciones pueden estar asociadas a una materia
      joinColumn: {
        name: "ID_materia", // Nombre de la columna FK
        referencedColumnName: "ID_materia", // Referencia la columna id en Materia
      },
      nullable: false, // Obligatoria (tiene que haber una materia)
    }
  },
});

export default ImparteSchema;