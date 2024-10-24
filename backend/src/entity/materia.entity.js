"use strict";
import { EntitySchema } from "typeorm";


const MateriaSchema = new EntitySchema({
  name: "Materia",
  tableName: "materias",
  columns: {
    id_Materia: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombreMateria: {
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
    imparte: {
      target: "Imparte",  
      type: "one-to-many",
      inverseSide: "materia",
    },
  },
  indices: [
    {
      name: "IDX_MATERIA",
      columns: ["id_Materia"],
      unique: true,
    },
  ]
});

export default MateriaSchema;