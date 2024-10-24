"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import atrasoRoutes from "./atraso.routes.js";
const router = Router();
router.get("/", (req, res) => {
    res.status(200).json({ message: "API is running" });
});

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/atraso", atrasoRoutes);

export default router;