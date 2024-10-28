"use strict";
import { Router } from "express";
import {
    registrarAtraso,
    verAtrasos
    } from "../controllers/atraso.controller.js";
import {
    manejarAprobarJustificativo,
    manejarRechazarJustificativo
    } from "../controllers/justificativo.controller.js";
import { sendCustomEmail } from "../controllers/email.controller.js";

const router = Router();


router  
    .post("/registrar", registrarAtraso)
    .get("/atrasos", verAtrasos)
    .post("/aprobar/:ID_atraso", manejarAprobarJustificativo)
    .post("/rechazar/:ID_atraso", manejarRechazarJustificativo)
    .post("/enviar", sendCustomEmail);

export default router;