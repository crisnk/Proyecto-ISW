"use strict";
import { EntitySchema } from "typeorm";

const PracticaSchema = new EntitySchema({
  name: "Practica", 
  tableName: "practicas", 
  columns: {
    ID_practica: {
      type: "int",
      primary: true,
      generated: true, 
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    descripcion: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    cupo: {
      type: "int",
      nullable: false, 
    },
    direccion: {
      type: "varchar",
      length: 255,
      nullable: false, 
    },
    estado: {
      type: "varchar",
      length: 255,
      nullable: false, 
    },
  },
  relations: {
    ID_especialidad: {
      type: "many-to-one", 
      target: "Especialidad", 
      joinColumn: {
        name: "ID_especialidad", 
        referencedColumnName: "ID_especialidad", 
      },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});

export default PracticaSchema;
