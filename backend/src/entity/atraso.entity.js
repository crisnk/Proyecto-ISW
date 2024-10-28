"use strict";
import { EntitySchema } from "typeorm";

const AtrasoSchema = new EntitySchema({
  name: "Atraso", // Nombre de la entidad
  tableName: "atrasos", // Nombre de la tabla en la base de datos
  columns: {
    ID_atraso: {
      type: "int",
      primary: true,
      generated: true, // Generar automáticamente el ID
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    hora: {
      type: "time",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
  },
  relations: {
    rut: {
      type: "many-to-one",
      target: "User", 
      joinColumn: {
        name: "rut", 
        referencedColumnName: "rut" 
      },
      nullable: false, // No puede ser nulo, se debe asignar siempre un usuario.  OJO preguntar al tarro acerca de esto
    },
  },
  indices: [
    {
      name: "IDX_ATRASO_RUT",
      columns: ["rut"],
    },
  ],
});

export default AtrasoSchema;