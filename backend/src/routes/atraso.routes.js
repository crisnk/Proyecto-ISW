"use strict";
import { Router } from "express";
import { registrarAtraso } from "../controllers/atraso.controller.js";
import { manejarAprobarJustificativo } from "../controllers/justificativo.controller.js";

const router = Router();


router.post("/registrar", registrarAtraso);
router.post("/aprobar", manejarAprobarJustificativo);

export default router;