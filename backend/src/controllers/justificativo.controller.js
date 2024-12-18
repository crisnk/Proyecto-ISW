import { createJustificativo, aprobarJustificativo, rechazarJustificativo, obtenerDocumentoJustificante, obtenerJustificativo, findJustificativo } from "../services/justificativo.service.js";
import { findAtraso  } from "../services/atraso.service.js";
import { sendEmailDefault } from "../controllers/email.controller.js";
import { handleErrorClient, handleSuccess, handleErrorServer } from "../handlers/responseHandlers.js";
import { extraerRut } from "../helpers/rut.helper.js";
import { justificativoValidation} from "../validations/justificativo.validation.js";
import moment from "moment-timezone";
import { drive } from '../config/googleService.js'; // Asegúrate de que esta importación sea correcta
import { Readable } from 'stream';
import { getUserSocketId } from '../services/socket.service.js';


  export async function generarJustificativo(req, res){
    try{
      const { error } = justificativoValidation.validate(req.body);
      if (error) {
        return handleErrorClient(res, 400, "Error de validación", error.message);
      }    
      const rut = await extraerRut(req);
      const estado = 'pendiente';
      const { motivo, ID_atraso} = req.body;

      const atraso = await findAtraso(rut, ID_atraso);    
      if (!atraso) {
        return handleErrorClient(res, 404, 'Atraso no encontrado');
      }
  
      const justificativo = await findJustificativo(rut, ID_atraso);    
      if (justificativo) {
        return handleErrorClient(res, 404, 'Atraso ya tiene asociado un justificativo');
      }    
      
      const fechaAtraso = moment(atraso.fecha, "YYYY-MM-DD"); // Formato de la fecha del atraso
      const fechaLimite = fechaAtraso.add(5, 'days'); // Se suman 5 días a la fecha del atraso
      const fechaActual = moment().tz("America/Santiago").startOf('day');
      if (fechaActual.isAfter(fechaLimite)) {
        return handleErrorClient(res, 400, `El justificativo ya no puede ser subido. La fecha límite fue ${fechaLimite.format("DD-MM-YYYY")}`);
      }

      let documento = null;
      const archivo = req.file;
      if (archivo) {
        try {
          const archivoStream = Readable.from(archivo.buffer);
          const fileMetadata = { name: archivo.originalname, mimeType: archivo.mimetype };
          const media = { body: archivoStream };
          
          const driveResponse = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink'
          });
      
          const fileId = driveResponse.data.id;
      
          await drive.permissions.create({
            fileId: fileId,
            requestBody: { role: 'reader', type: 'anyone' }
          });
      
          documento = driveResponse.data.webViewLink;
        } catch (error) {
          console.error('Error subiendo archivo a Google Drive:', error);
          return handleErrorServer(res, 500, 'Error al subir el archivo a Google Drive');
        }
      }

      const response = await createJustificativo({
            rut,
            motivo,
            estado,
            documento,
            ID_atraso
      });
      const rutProfesor = response.profesor.rut;
      const nombreAlumno = response.alumno.nombre;
      console.log(rutProfesor);
      console.log(nombreAlumno);

      const io = req.app.get('socketio'); 

      // Verificamos si el profesor está conectado
      const socketId = getUserSocketId(rutProfesor);

      console.log('socketIdProfesor:', socketId);
        if (socketId) {
          io.to(socketId).emit('recibo-notificacion', {
            mensaje: `El alumno ${nombreAlumno} ha subido un justificativo`,
          });
          console.log(`Notificación enviada al profesor con RUT: ${rutProfesor} (Socket ID: ${socketId})`);
        } else {
          console.log(`El profesor con RUT ${rutProfesor} no está conectado.`);
        }


        handleSuccess(res, 200, "Justificativo Creado", response);
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

    const { email, motivo } = req.body;
    const { ID_atraso } = req.params;
    
    const { errorJoi } = justificativoValidation.validate({ motivo, ID_atraso });
    if (errorJoi) return handleErrorClient(res, 400, errorJoi.details[0].message);
  
    const [justificativo, error] = await rechazarJustificativo();
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