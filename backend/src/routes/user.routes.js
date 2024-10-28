"use strict";
import { Router } from "express";
import { isAuthorized  } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  

router
  .get("/", isAuthorized("administrador"), getUsers)
  .get("/detail", isAuthorized("administrador"), getUser)
  .patch("/detail", isAuthorized("administrador"), updateUser)
  .delete("/detail", isAuthorized("administrador"), deleteUser);

export default router;