"use strict";
import Justificativo from "../entity/justificativo.entity.js";
import Atraso from "../entity/atraso.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function aprobarJustificativo(ID_atraso) {
    try {
      const atrasoRepository = AppDataSource.getRepository(Atraso);
      const atraso = await atrasoRepository.findOne({ where: { ID_atraso}});

      if (!atraso) return [null, "Atraso no encontrado"];

      atraso.estado = "inactivo";
      await atrasoRepository.save(atraso);
  
      const justificativoRepository = AppDataSource.getRepository(Justificativo);
      const justificativo = await justificativoRepository.findOne({ where: { ID_atraso } });

      if (!justificativo) return [null, "Justificativo no encontrado"];
      
      justificativo.estado = "aprobado"; 
      await justificativoRepository.save(justificativo);
      
      return [justificativo, null];
    } catch (error) {
      console.error("Error al aprobar el justificativo:", error);
      return [null, "Error interno del servidor"];
    }
  }
  
  export async function rechazarJustificativo(ID_atraso, motivo) {
    try {
      const justificativoRepository = AppDataSource.getRepository(Justificativo);
      const justificativo = await justificativoRepository.findOne({ where: { ID_atraso } });
  
      if (!justificativo) return [null, "Justificativo no encontrado"];
      
      justificativo.estado = "rechazado"; 
      justificativo.motivoRechazo = motivo; 
      await justificativoRepository.save(justificativo);
      
      return [justificativo, null];
    } catch (error) {
      console.error("Error al rechazar el justificativo:", error);
      return [null, "Error interno del servidor"];
    }
  }
  