"use strict";
import { EntitySchema } from "typeorm";

const PertenceSchema = new EntitySchema({
    name: "Pertence",
    tableName: "Pertenece",
    relations: {
      RUN: {
        type: "many-to-one", 
        target: "Persona",
        joinColumn: {
          name: "RUN",
          referencedColumnName: "RUN"
        },
        nullable: false, // No puede ser nulo, se debe asignar siempre un usuario
      },
      ID_Curso: {
        type: "one-to-many",
        target: "Curso",
        joinColumn: {
          name: "ID_curso",
          referencedColumnName: "ID_curso"
        },
      },
    },
})