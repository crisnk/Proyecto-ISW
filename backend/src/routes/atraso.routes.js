"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { generarJustificativo,
         registrarAtraso,
         verAtrasos
        } from "../controllers/atraso.controller.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";

import {
    manejarAprobarJustificativo,
    manejarRechazarJustificativo
    } from "../controllers/justificativo.controller.js";
import { sendCustomEmail } from "../controllers/email.controller.js";
const router = Router();

router.use(authenticateJwt);
router  
    .post("/registrar", registrarAtraso)
    .post("/generar",  isAuthorized("alumno"), generarJustificativo)
    .get("/atrasos", verAtrasos)
    .post("/aprobar/:ID_atraso", manejarAprobarJustificativo)
    .post("/rechazar/:ID_atraso", manejarRechazarJustificativo)
    .post("/enviar", sendCustomEmail);
    

export default router;