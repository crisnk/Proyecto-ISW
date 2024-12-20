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
    obtenerPostulaciones,
    updatePostulacion,
} from "../controllers/practica.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);
router
    // Sólo EDP, jefeUTP y admin
    .post("/crear", isAuthorized("EDP", "jefeUTP", "administrador"), crearPractica)
    .put("/modificar/:ID_practica", isAuthorized("EDP", "jefeUTP", "administrador"), modificarPractica)
    .delete("/delete/:ID_practica", isAuthorized("EDP", "jefeUTP", "administrador"), eliminarPractica)
    .patch("/postulacion/update", isAuthorized("EDP", "jefeUTP", "administrador"), updatePostulacion)

    // Alumnos
    .post("/postular/:ID_practica", isAuthorized("alumno"), postularPractica)
    .delete("/postulacion/delete/:ID_postulacion", isAuthorized("alumno"), cancelarPostulacion)
    .get("/postulaciones", isAuthorized("alumno", "EDP"), obtenerPostulaciones)

    // Usuarios
    .get("/all", obtenerPracticas)
    .get("/:ID_practica", obtenerPractica);


export default router;