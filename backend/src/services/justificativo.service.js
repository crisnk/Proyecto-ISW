// services/justificativosService.js
"use strict";
import Justificativo from "../entity/justificativo.entity.js";
import { AppDataSource } from "../config/configDb.js";
// Aprobar Justificativo
export async function aprobarJustificativo(ID_atraso) {
    try {
      const justificativoRepository = AppDataSource.getRepository(Justificativo);
      const justificativo = await justificativoRepository.findOne({ where: { ID_atraso } });
  
      if (!justificativo) return [null, "Justificativo no encontrado"];
      
      justificativo.estado = "aprobado"; // Se aprueba el justificativo
      await justificativoRepository.save(justificativo);
      
      return [justificativo, null];
    } catch (error) {
      console.error("Error al aprobar el justificativo:", error);
      return [null, "Error interno del servidor"];
    }
  }
  
  // Rechazar Justificativo
  export async function rechazarJustificativo(ID_atraso, motivo) {
    try {
      const justificativoRepository = AppDataSource.getRepository(Justificativo);
      const justificativo = await justificativoRepository.findOne({ where: { ID_atraso } });
  
      if (!justificativo) return [null, "Justificativo no encontrado"];
      
      justificativo.estado = "rechazado"; // Se rechaza el justificativo
      justificativo.motivoRechazo = motivo; // Se guarda el motivo de rechazo
      await justificativoRepository.save(justificativo);
      
      return [justificativo, null];
    } catch (error) {
      console.error("Error al rechazar el justificativo:", error);
      return [null, "Error interno del servidor"];
    }
  }
  