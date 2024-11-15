"use strict";
import { EntitySchema } from "typeorm";

const ImparteSchema = new EntitySchema({
  name: "Imparte",
  tableName: "imparten",
  columns: {
    ID_imparte: {
      type: "int",
      primary: true,
      generated: true,
    },
    ID_materia: {
      type: "int",
      nullable: false, 
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
    dia: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    bloque: {
      type: "varchar",
      length: 15,
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
    profesor: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "rut",
        referencedColumnName: "rut",
      },
      nullable: true, 
    },
    curso: {
      target: "Curso",
      type: "many-to-one",
      joinColumn: {
        name: "ID_curso",
        referencedColumnName: "ID_curso",
      },
      onDelete: "CASCADE",
    },
    materia: {
      target: "Materia",
      type: "many-to-one",
      joinColumn: {
        name: "ID_materia",
        referencedColumnName: "ID_materia",
      },
      onDelete: "CASCADE",
    },
  },
});

export default ImparteSchema;
