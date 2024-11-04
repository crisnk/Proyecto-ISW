import { Router } from "express";
import {
  crearHorario,
  eliminarHorario,
  modificarHorario,
  verCursos,
  verHorarioCurso,
  verHorarioProfesor,
  verMaterias,
  verProfesores,
  verTodosHorarios,
} from "../controllers/horarios.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import isAuthorized from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.post("/asignar", isAuthorized(["jefeUTP", "administrador"]), crearHorario);
router.patch("/modificar/:id", isAuthorized(["jefeUTP", "administrador"]), modificarHorario);
router.delete("/eliminar/:id", isAuthorized(["jefeUTP", "administrador"]), eliminarHorario);
router.get("/ver/profesor", isAuthorized(["profesor", "jefeUTP", "administrador"]), verHorarioProfesor);
router.get("/ver/curso/:ID_curso", isAuthorized(["alumno", "profesor", "jefeUTP", "administrador"]), verHorarioCurso);
router.get("/ver/todos", isAuthorized(["jefeUTP", "profesor", "administrador"]), verTodosHorarios);
router.get("/materias", verMaterias);
router.get("/cursos", isAuthorized(["jefeUTP", "administrador"]), verCursos);
router.get("/profesores", isAuthorized(["jefeUTP", "administrador"]), verProfesores);

export default router;
