"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";
import {upload, handleFileSizeLimit } from "../middlewares/subirDocumento.middleware.js"
import {
    generarJustificativo,
    manejarAprobarJustificativo,
    manejarRechazarJustificativo,
    verArchivoJustificativo,
    verJustificativo,
} from "../controllers/justificativo.controller.js";


const router = Router();
router.use(authenticateJwt);
router  
    .post("/generar",  isAuthorized("alumno"), upload, handleFileSizeLimit , generarJustificativo)
    .get('/archivo/:filePath', isAuthorized("alumno"), verArchivoJustificativo)
    .post("/aprobar/:ID_atraso", manejarAprobarJustificativo)
    .post("/rechazar/:ID_atraso", manejarRechazarJustificativo)
    .get("/ver/:ID_atraso", verJustificativo);
export default router;