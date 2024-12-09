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
  .get("/getusers", isAuthorized("administrador"), getUsers)
  .get("/getuser", isAuthorized("administrador"), getUser)
  .patch("/update", isAuthorized("administrador"), updateUser)
  .delete("/delete", isAuthorized("administrador"), deleteUser);

export default router;
