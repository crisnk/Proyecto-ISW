"use strict";

import { Router } from "express";
import { crearPractica, obtenerPracticas, obtenerPractica, modificarPractica, eliminarPractica } from "../controllers/practica.controller.js";

const router = Router();

router
    .post("/crear", crearPractica)
    .get("/all", obtenerPracticas)
    .get("/:ID_practica", obtenerPractica)
    .put("/modificar/:ID_practica", modificarPractica)
    .delete("/:ID_practica", eliminarPractica);


export default router;