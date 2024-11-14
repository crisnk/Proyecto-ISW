"use strict";

import { Router } from "express";
import {
    crearPractica,
    obtenerPracticas,
    obtenerPractica,
    modificarPractica,
    eliminarPractica,
    postularPractica,
    cancelarPostulacion,
} from "../controllers/practica.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);
router
    // Sólo EDP, jefeUTP y admin
    .post("/crear", isAuthorized("EDP", "jefeUTP", "administrador"), crearPractica)
    .put("/modificar/:ID_practica", isAuthorized("EDP", "jefeUTP", "administrador"), modificarPractica)
    .delete("/:ID_practica", isAuthorized("EDP", "jefeUTP","administrador"), eliminarPractica)

    // Usuarios
    .get("/all", obtenerPracticas)
    .get("/:ID_practica", obtenerPractica)
    .put("/modificar/:ID_practica", modificarPractica)
    .delete("/:ID_practica", eliminarPractica)

    .post("/postular/:ID_practica", postularPractica)
    .delete("/postulacion/:ID_practica", cancelarPostulacion);


export default router;