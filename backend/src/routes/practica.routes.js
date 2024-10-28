"use strict";

import { Router } from "express";
import { crearPractica, modificarPractica } from "../controllers/practica.controller.js";

const router = Router();

router
    .post("/crear", crearPractica)
    .put("/modificar/:ID_practica", modificarPractica);

export default router;