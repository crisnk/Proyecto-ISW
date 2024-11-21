"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { registrarAtraso,
         verAtrasos,
         tablaAtrasosAlumnos,
         infoAtraso
        } from "../controllers/atraso.controller.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";
import {upload, handleFileSizeLimit } from "../middlewares/subirDocumento.middleware.js"
import {
        generarJustificativo,
        manejarAprobarJustificativo,
        manejarRechazarJustificativo,
        verArchivoJustificativo
    } from "../controllers/justificativo.controller.js";
import { sendCustomEmail } from "../controllers/email.controller.js";
const router = Router();

router.use(authenticateJwt);
router  
    .post("/registrar", registrarAtraso)
    .post("/generar",  isAuthorized("alumno"), upload, handleFileSizeLimit , generarJustificativo)
    .get("/atrasos",isAuthorized("alumno"), verAtrasos)
    .get("/tablaAlumnos",isAuthorized("alumno", "profesor"), tablaAtrasosAlumnos)
    .get('/archivo/:filePath', isAuthorized("alumno"), verArchivoJustificativo)
    .post("/aprobar/:ID_atraso", manejarAprobarJustificativo)
    .post("/rechazar/:ID_atraso", manejarRechazarJustificativo)
    .post("/enviar", sendCustomEmail)
    .get("/infoAtraso", infoAtraso);
export default router;