"use strict";
import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";


const router = Router();


router.post("/login", login);
router.post("/logout",  logout)


router.post("/register", register)

export default router;