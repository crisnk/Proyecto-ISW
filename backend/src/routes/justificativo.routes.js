"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";
import { upload } from '../config/googleService.js'; 
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
    .post("/generar",  isAuthorized("alumno"), upload.single('file'), generarJustificativo)
    .get('/archivo/:filePath', isAuthorized("alumno"), verArchivoJustificativo)
    .post("/aprobar/:ID_atraso", isAuthorized("profesor"), manejarAprobarJustificativo)
    .post("/rechazar/:ID_atraso", isAuthorized("profesor"), manejarRechazarJustificativo)
    .get("/ver/:ID_atraso", isAuthorized("profesor"), verJustificativo);
export default router;