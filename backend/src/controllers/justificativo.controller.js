// controllers/justificativosController.js
import { aprobarJustificativo } from "../services/justificativo.service.js";
import { rechazarJustificativo } from "../services/justificativo.service.js";
import { handleErrorClient, handleSuccess, handleErrorServer } from "../handlers/responseHandlers.js";

export async function manejarAprobarJustificativo(req, res) {



    
  try {
    const { ID_atraso } = req.body; // Obtener ID_atraso del cuerpo de la solicitud

    // Llamar al servicio para aprobar el justificativo
    const [justificativo, error] = await aprobarJustificativo(ID_atraso);

    if (error) return handleErrorClient(res, 404, error); // Manejo de error si no se encuentra el justificativo

    handleSuccess(res, 200, "Justificativo aprobado", justificativo); // Responder con éxito
  } catch (error) {
    handleErrorServer(res, 500, error.message); // Manejo de error en el servidor
  }
}


export async function manejarRechazarJustificativo(req, res) {
  try {
    const { ID_atraso, motivo } = req.body; // Obtener ID_atraso y motivo del cuerpo de la solicitud

    // Llamar al servicio para rechazar el justificativo
    const [justificativo, error] = await rechazarJustificativo(ID_atraso, motivo);

    if (error) return handleErrorClient(res, 404, error); // Manejo de error si no se encuentra el justificativo

    handleSuccess(res, 200, "Justificativo rechazado", justificativo); // Responder con éxito
  } catch (error) {
    handleErrorServer(res, 500, error.message); // Manejo de error en el servidor
  }
}