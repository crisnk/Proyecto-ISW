"use strict";
import { EntitySchema } from "typeorm";
import PersonaSchema from './persona.entity.js';
import PracticaSchema from './practica.entity.js';

const PostulaSchema = new EntitySchema({
  name: "Postula",
  tableName: "postulaciones",
  relations: {
    RUN: {
      type: "many-to-many", 
      target: "Persona",
      joinColumn: {
        name: "RUN",
        referencedColumnName: "RUN"
      },
      nullable: false, // No puede ser nulo, se debe asignar siempre un usuario
    },
    ID_practica: {
      type: "many-to-many",
      target: "Practica",
      joinColumn: {
        name: "ID_practica",
        referencedColumnName: "ID_practica"
      },
    },
  },
})

export default PostulaSchema;