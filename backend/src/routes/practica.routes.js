"use strict";

import { Router } from "express";
import { crearPractica } from "../controllers/practica.controller.js";

const router = Router();

router
    .post("/crear", crearPractica);

export default router;