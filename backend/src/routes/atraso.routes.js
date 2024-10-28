"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { registrarAtraso,
         generarJustificativo
        } from "../controllers/atraso.controller.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";


const router = Router();

router.use(authenticateJwt);
router  
    .post("/registrar", isAuthorized("alumno"), registrarAtraso)
    .post("/generar",  isAuthorized("alumno"), generarJustificativo);
 

export default router;