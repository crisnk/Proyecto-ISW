"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import horarioRoutes from "./horario.routes.js";
import { sendNotificacion } from "../services/notificacion.service.js"; 


const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/horarios", horarioRoutes)
    .post("/test-email", async (req, res) => {
        const { rut, subject, mensaje } = req.body;
        try {
            await sendNotificacion(rut, subject, mensaje);
            res.status(200).json({ message: "Correo enviado exitosamente" });
        } catch (error) {
            res.status(500).json({ message: "Error al enviar correo", error: error.message });
        }
    });

export default router;