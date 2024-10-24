"use strict";
import { EntitySchema } from "typeorm";
import AtrasoSchema from './atraso.entity.js';
import PersonaSchema from './persona.entity.js';

const JustificativoSchema = new EntitySchema({
  name: "Justificativo", // Nombre de la entidad
  tableName: "justificativos", // Nombre de la tabla en la base de datos
  columns: {
    ID_Justificativo: {
      type: "int",
      primary: true,
      generated: true, // Generar automáticamente el ID
    },
    motivo: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    documento: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
  },
  relations: {
    ID_atraso: {
      type: "one-to-one", // Definir la relación de uno a uno (un justificativos puede ser de una persona)
      target: "Atraso", // Referencia a la entidad Atraso
      joinColumn: {
        name: "ID_atraso", // Nombre del campo FK en la tabla "justificativos"
        referencedColumnName: "ID_atraso" // Campo referenciado en la tabla "atrasos"
      },
      nullable: false, // No puede ser nulo, se debe asignar siempre un atraso
      onDelete: "CASCADE", // Si se elimina un atraso, también se eliminarán los registros de justificativo relacionados
    },
    RUN: {
        type: "one-to-one", 
        target: "Persona", 
        joinColumn: {
          name: "RUN", 
          referencedColumnName: "RUN" 
        },
        nullable: false, 
        onDelete: "CASCADE", 
    },
  },
  indices: [
    {
      name: "IDX_JUSTIFICATIVO_ID_ATRASO",
      columns: ["ID_Atraso"],
    },
  ],
});

export default JustificativoSchema;
