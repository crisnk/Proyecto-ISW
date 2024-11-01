"use strict";
import { EntitySchema } from "typeorm";

const ImparteSchema = new EntitySchema({
  name: "Imparte",
  tableName: "imparten",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    ID_materia: {
      type: "int",
      
    },
    ID_curso: {
      type: "int",
      
    },
    rut: {
      type: "int",
      
    },
    dia: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    hora_Inicio: {
      type: "time",
      nullable: false,
    },
    hora_Fin: {
      type: "time",
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
    profesor:{
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "rut",
        referencedColumnName: "rut",
      },
      
    },
    curso: {
      target: "Curso",
      type: "many-to-one", 
      joinColumn: {
        name: "ID_curso", 
        referencedColumnName: "ID_curso", 
      },
      
    },

    materia: {
      target: "Materia",
      type: "many-to-one", 
      joinColumn: {
        name: "ID_materia", 
        referencedColumnName: "ID_materia", 
      },

    }
  },
});

export default ImparteSchema;