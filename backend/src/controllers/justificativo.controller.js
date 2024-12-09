import { createJustificativo, aprobarJustificativo, rechazarJustificativo, obtenerDocumentoJustificante, obtenerJustificativo } from "../services/justificativo.service.js";
import { findAtraso  } from "../services/atraso.service.js";
import { sendEmailDefault } from "../controllers/email.controller.js";
import { handleErrorClient, handleSuccess, handleErrorServer } from "../handlers/responseHandlers.js";

import {  HOST, PORT } from "../config/configEnv.js";
import { extraerRut } from "../helpers/rut.helper.js";
import { justificativoValidation } from "../validations/justificativo.validation.js";

export async function generarJustificativo(req, res){
  try{
    const rut = await extraerRut(req);
    const estado = 'pendiente';
    const { motivo, ID_atraso} = req.body;

    const { error } = justificativoValidation.validate(req.body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    
    const atraso = await findAtraso(rut, ID_atraso);
    
    if (!atraso) {
      return handleErrorClient(res, 404, 'Atraso no encontrado');
    }
      const documento = req.file ? `http://${HOST}:${PORT}/api/src/uploads/${req.file.filename}` : null;
      // Crear el justificativo
      const nuevoJustificativo = await createJustificativo({
          rut,
          motivo,
          estado,
          documento,
          ID_atraso
      });
      handleSuccess(res, 200, "Justificativo Creado", nuevoJustificativo);
  }catch (error){
    handleErrorServer(res, 500, error.message);
  }
}

export async function verArchivoJustificativo(req, res) {
  try {
    const { filePath } = req.params;
    const file = await obtenerDocumentoJustificante(filePath);

    res.sendFile(file);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function manejarAprobarJustificativo(req, res) {
  try {
    console.log("Cuerpo de la solicitud recibido:", req.body);

    const { email } = req.body;
    const { ID_atraso } = req.params;

    if (!email) {
      return handleErrorClient(res, 400, "El email del alumno es requerido");
    }

    const justificativo = await aprobarJustificativo(ID_atraso);

    if (!justificativo) {
      return handleErrorClient(res, 404, "Justificativo no encontrado");
    }

    try {
      await sendEmailDefault({
        body: {
          email: email,
          subject: "Justificativo aprobado",
          message: `Hola, su justificativo con ID ${ID_atraso} ha sido aprobado.`,
        },
      });
    } catch (emailError) {
      console.error("Error al enviar el correo:", emailError);
      return handleErrorClient(res, 500, "Justificativo aprobado, pero fallo al enviar el correo.");
    }

    // Enviar la respuesta al cliente
    handleSuccess(res, 200, "Justificativo aprobado", justificativo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}


export async function manejarRechazarJustificativo(req, res) {
  try {
    const token = req.cookies.jwt;

    if (!token) {
        return handleErrorClient(res, 401, "No se ha proporcionado un token de autenticación");
    }

    const { email } = req.body;
    const { ID_atraso } = req.params;
    const { motivo } = req.body;
  
    const [justificativo, error] = await rechazarJustificativo(ID_atraso, motivo);
    if (!email) return handleErrorClient(res, 400, "El email del alumno es requerido");

    if (error) return handleErrorClient(res, 404, error);

    
    handleSuccess(res, 200, "Justificativo rechazado", justificativo);

   
    await sendEmailDefault({
        body: {
            email: email, 
            subject: "Justificativo rechazado",
            message: `Hola, se le notifica que su justificativo con ID ${ID_atraso} ha sido rechazado. Motivo: ${motivo}`,
        },
    });

    console.log(`Correo enviado a ${email} notificando el rechazo del justificativo.`);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function verJustificativo(req,res) {
  try {
    const { ID_atraso } = req.params;

    const [justificativo, errorJustificativo] = await obtenerJustificativo( ID_atraso);

    if (errorJustificativo) return handleErrorClient(res, 404, errorJustificativo);
    
    justificativo.length === 0
    ? handleSuccess(res, 204)
    : handleSuccess(res, 200, "Justificativo encontrado", justificativo);
  } catch (error) {
    handleErrorServer(res,500,error.message);
  }
};