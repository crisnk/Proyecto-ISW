"use strict";
import { Router } from "express";
import { isRole } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,

} from "../controllers/user.controller.js";
import {
  assignHorario,
  createHorario,
  getAlumnoHorario,
  getProfesorHorario,
  
} from "../controllers/horarios.controller.js";


const router = Router();

router
  .use(authenticateJwt);
// Admin
router
 .route("/admin")
 .get(isRole("admin"), getUser)
 .get(isRole("admin"), getUsers)
 .patch(isRole("admin"), updateUser)
 .delete(isRole("admin"), deleteUser);
//Jefe UTP
router 
  .route("/jefeUTP")
 .post(isRole("jefeUTP"), createHorario)
 .patch(isRole("jefeUTP"), assignHorario);

//Profesor
router

.route("/profesor/horario")
.get(isRole("profesor"), getProfesorHorario);

router
 .route("/alumno/horario")
 .get(isRole("alumno"), getAlumnoHorario);

export default router;