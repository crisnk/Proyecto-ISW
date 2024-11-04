import { aprobarJustificativo, rechazarJustificativo  } from "../services/justificativo.service.js";
import { sendEmailDefault } from "../controllers/email.controller.js";
import { handleErrorClient, handleSuccess, handleErrorServer } from "../handlers/responseHandlers.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function manejarAprobarJustificativo(req, res) {
  try {
    const token = req.cookies.jwt;

    if (!token) {
        return handleErrorClient(res, 401, "No se ha proporcionado un token de autenticación");
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const { email } = decoded;

    if (!email) {
        return handleErrorClient(res, 401, "Token inválido o email no presente en el token");
    }

    const { ID_atraso } = req.params; 
    if (!ID_atraso) return handleErrorClient(res, 400, "ID_atraso es requerido");

    const [justificativo, error] = await aprobarJustificativo(ID_atraso);

    if (error) return handleErrorClient(res, 404, error); 

    handleSuccess(res, 200, "Justificativo aprobado", justificativo); 
    console.log(email);
    const resEmail = await sendEmailDefault({
        body: {
            email: email,
            subject: "Justificativo aprobado",
            message: "Se le notifica que su atraso fue aprobado",
        }
    });
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

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const { email } = decoded;

    if (!email) {
        return handleErrorClient(res, 401, "Token inválido o email no presente en el token");
    }
    const { ID_atraso, motivo } = req.body;
  
    const [justificativo, error] = await rechazarJustificativo(ID_atraso, motivo);
    
    if (error) return handleErrorClient(res, 404, error);
    
    handleSuccess(res, 200, "Justificativo rechazado", justificativo); 
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}