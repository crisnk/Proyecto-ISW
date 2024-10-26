"use strict";
import { EntitySchema } from "typeorm";

export default new EntitySchema({
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
  indices: [
    {
      name: "IDX_CURSO",
      columns: ["ID_curso"],
      unique: true,
    },
  ],
  relations: {
    rut: {
      type: "one-to-one",
      target: "User",
      joinColumn: {
        name: "rut",
        referencedColumnName: "rut"
      },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});
