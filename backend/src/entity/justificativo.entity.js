"use strict";
import { EntitySchema } from "typeorm";


const JustificativoSchema = new EntitySchema({
  name: "Justificativo", 
  tableName: "justificativos", 
  columns: {
    ID_justificativo: {
      type: "int",
      primary: true,
      generated: true, 
    },
    motivo: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    documento: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    motivoRechazo: {
      type: "varchar",
      length: 255,
      nullable: true },
  },
  relations: {
    ID_atraso: {
      type: "one-to-one",
      target: "Atraso", 
      joinColumn: {
        name: "ID_atraso", 
        referencedColumnName: "ID_atraso" 
      },
      nullable: false, 
    }
  },
  indices: [
    {
      name: "IDX_JUSTIFICATIVO_ID_ATRASO",
      columns: ["ID_atraso"],
    },
  ],
});

export default JustificativoSchema;
