import { Router } from "express";
import {
  asignarProfesorAHorario,
  crearCurso,
  crearHorario,
  crearMateria,
  eliminarCurso,
  eliminarHorario,
  eliminarMateria,
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
router.get("/cursosregister", verCursos);


router.use(authenticateJwt);

router.patch("/asignar/profesor/:idHorario", isAuthorized(["jefeUTP", "administrador"]), asignarProfesorAHorario);
router.post("/asignar", isAuthorized(["jefeUTP", "administrador"]), crearHorario);
router.post("/asignar/curso", isAuthorized(["jefeUTP", "administrador"]), crearHorario);
router.post("/asignar/profesor", isAuthorized(["jefeUTP", "administrador"]), crearHorario);
router.patch("/modificar/:id", isAuthorized(["jefeUTP", "administrador"]), modificarHorario);
router.delete("/eliminar/:id", isAuthorized(["jefeUTP", "administrador"]), eliminarHorario);
router.get("/ver/profesor", isAuthorized(["profesor", "jefeUTP", "administrador"]), verHorarioProfesor);
router.get("/ver/curso/:ID_curso", isAuthorized(["alumno", "profesor", "jefeUTP", "administrador"]), verHorarioCurso);
router.get("/ver/todos", isAuthorized(["jefeUTP", "profesor", "administrador"]), verTodosHorarios);
router.get("/materias", verMaterias);
router.get("/cursos", isAuthorized(["jefeUTP", "administrador"]), verCursos);
router.get("/profesores", isAuthorized(["jefeUTP", "administrador"]), verProfesores);
router.post("/materias/crear", isAuthorized(["jefeUTP", "administrador"]), crearMateria);
router.post("/cursos/crear", isAuthorized(["jefeUTP", "administrador"]), crearCurso);
router.delete("/materias/eliminar/:ID_materia", isAuthorized(["jefeUTP", "administrador"]), eliminarMateria);
router.delete("/cursos/eliminar/:ID_curso", isAuthorized(["jefeUTP", "administrador"]), eliminarCurso);




export default router;
