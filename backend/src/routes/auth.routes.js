"use strict";
import { Router } from "express";
import { isRole } from "../middlewares/authorization.middleware.js";
import { login, logout, register } from "../controllers/auth.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router
  .post("/login", login)
  .post("/logout", logout)

  .post("/register", authenticateJwt, isRole("admin"), register);
  

export default router;