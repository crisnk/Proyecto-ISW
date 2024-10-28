"use strict";
import { Router } from "express";
import { asignaHorario, modificaHorario, verHorario } from "../controllers/horarios.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router
  .post("/asignar", isAuthorized("jefeUTP"), asignaHorario)
  .put("/modificar", isAuthorized("jefeUTP"), modificaHorario)
  .get("/ver", isAuthorized("jefeUTP", "profesor", "alumno"), verHorario);

export default router;
