"use strict";
import { EntitySchema } from "typeorm";

const EspecialidadSchema =  new EntitySchema({
  name: "Especialidad",
  tableName: "especialidades",
  columns: {
    ID_especialidad: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
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
  indices: [
    {
      name: "IDX_ESPECIALIDAD",
      columns: ["ID_especialidad"],
      unique: true,
    }
  ]
});

export default EspecialidadSchema;