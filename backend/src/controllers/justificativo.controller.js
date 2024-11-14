import { createJustificativo, aprobarJustificativo, rechazarJustificativo, obtenerDocumentoJustificante  } from "../services/justificativo.service.js";
import { findAtraso  } from "../services/atraso.service.js";
import { sendEmailDefault } from "../controllers/email.controller.js";
import { handleErrorClient, handleSuccess, handleErrorServer } from "../handlers/responseHandlers.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, HOST, PORT } from "../config/configEnv.js";

export async function generarJustificativo(req, res){
  try{
    const { motivo, fecha, hora } = req.body;
    const estado = 'pendiente';
    const token = req.cookies.jwt;

    if (!token) {
      return handleErrorClient(res, 401, "No se ha proporcionado un token de autenticación");
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const { rut } = decoded; 
    if (!rut) {
      return handleErrorClient(res, 401, "Token inválido o RUN no presente en el token");
    }   

    if (!motivo || !fecha || !hora ) {
      return handleErrorClient(res, 400, "Faltan datos necesarios");
    }
    
    const atraso = await findAtraso(rut, fecha, hora);
    
    if (!atraso) {
      return handleErrorClient(res, 404, 'Atraso no encontrado');
    }
      const documento = req.file ? `http://${HOST}:${PORT}/api/src/uploads/${req.file.filename}` : null;
      const ID_atraso = atraso.ID_atraso;
      // Crear el justificativo
      const nuevoJustificativo = await createJustificativo({
          rut,
          motivo,
          estado,
          documento,
          ID_atraso
      });
      res.status(201).json({
        justificativo: nuevoJustificativo
      });
  }catch (error){
    console.error("Error:", error);
    res.status(500).json({ message: "Error al procesar justificativo" });
  }
}

export async function verArchivoJustificativo(req, res) {
  try {
    const { filePath } = req.params;
    const file = await obtenerDocumentoJustificante(filePath);

    res.sendFile(file);
  } catch (error) {
    console.error('Error al acceder al archivo:', error);
    res.status(404).json({ message: 'Archivo no encontrado' });
  }
}

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
    const { ID_atraso, motivo } = req.body;
  
    const [justificativo, error] = await rechazarJustificativo(ID_atraso, motivo);
    
    if (error) return handleErrorClient(res, 404, error);
    
    handleSuccess(res, 200, "Justificativo rechazado", justificativo); 
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}