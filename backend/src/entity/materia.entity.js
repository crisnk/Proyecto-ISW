"use strict";
import { EntitySchema } from "typeorm";


const MateriaSchema = new EntitySchema({
  name: "Materia",
  tableName: "materias",
  columns: {
    ID_materia: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 55,
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
      imparten: {
        type: "one-to-many",
        target: "Imparte",
        inverseSide: "materia",
        onDelete: "CASCADE", 
      },
    },
  });

export default MateriaSchema;