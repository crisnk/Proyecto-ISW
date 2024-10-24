"use strict";
import { EntitySchema } from "typeorm";

const PersonaSchema = new EntitySchema({
  name: "Persona",
  tableName: "Personas",
  columns: {
    RUN: {
      type: "varchar",
      primaryKey: true,
      length: 12,
      nullable: false,
      unique: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    correo: {
      type: "varchar",
      length: 255,
      nullable: false,
      unique: true,
    },
    direccion: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    rol: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    password: {
      type: "varchar",
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
      name: "IDX_PERSONA_RUN",
      columns: ["RUN"],
      unique: true,
    },
    {
      name: "IDX_PERSONA_CORREO",
      columns: ["correo"],
      unique: true,
    },
  ],
});

export default PersonaSchema;