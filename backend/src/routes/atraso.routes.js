"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { registrarAtraso,
         verAtrasos,
         infoAtraso
        } from "../controllers/atraso.controller.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";
import { sendCustomEmail } from "../controllers/email.controller.js";
const router = Router();

router.use(authenticateJwt);
router  
    .post("/registrar", isAuthorized("alumno"), registrarAtraso)
    .get("/atrasos", verAtrasos)
    .post("/enviar", sendCustomEmail)
    .get("/infoAtraso", infoAtraso);
export default router;