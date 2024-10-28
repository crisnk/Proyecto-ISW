"use strict";
import { Router } from "express";
import { registrarAtraso } from "../controllers/atraso.controller.js";

const router = Router();


router  
    .post("/registrar", registrarAtraso);


export default router;