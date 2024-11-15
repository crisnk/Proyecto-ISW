"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import horarioRoutes from "./horario.routes.js";
import atrasoRoutes from "./atraso.routes.js";
import practicaRoutes from "./practica.routes.js";
import justificativoRoutes from "./justificativo.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/horarios", horarioRoutes)
    .use("/atraso", atrasoRoutes)
    .use("/practica", practicaRoutes)
    .use("/justificativo", justificativoRoutes);
export default router;