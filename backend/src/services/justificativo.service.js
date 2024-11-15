"use strict";
import Justificativo from "../entity/justificativo.entity.js";
import Atraso from "../entity/atraso.entity.js";
import { AppDataSource } from "../config/configDb.js";
import fs from 'fs';
import path from 'path';

export async function createJustificativo(justificativoData){
  try{
    const justificativoRepository = AppDataSource.getRepository(Justificativo);
    const nuevoJustificativo = justificativoRepository.create(justificativoData);
    await justificativoRepository.save(nuevoJustificativo);

    return nuevoJustificativo;

  }catch (error){
    console.error('Error al crear justificativo:', error);
    throw new Error('No se pudo crear el justificativo');
  }
}

export async function obtenerDocumentoJustificante(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', 'uploads', filePath);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    } else {
      throw new Error('Archivo no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener el archivo:', error);
    throw new Error('No se pudo acceder al archivo');
  }
}

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
  