"use strict";
import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import isAuthorized from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();


router.post("/login", login);
router.post("/logout",  logout)

router.use(authenticateJwt);

router.post("/register", isAuthorized("administrador"), register)

export default router;