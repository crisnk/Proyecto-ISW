import { Router } from "express";
import {
  crearCurso,
  crearHorarioCurso,
  crearHorarioProfesor,
  crearMateria,
  eliminarCurso,
  eliminarHorarioProfesor,
  eliminarMateria, 
  getEmailByProfesor, 
  getEmailsByCurso ,
  sendNotificationToCourse,
  sendNotificationToProfessor,
  verCursos,
  verHorarioByAlumno,
  verHorarioCurso,
  verHorarioProfesor,
  eliminarHorarioCurso,
  verMaterias,
  verProfesores,
} from "../controllers/horarios.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import isAuthorized from "../middlewares/authorization.middleware.js";

const router = Router();

router.get("/materias", verMaterias);
router.get("/cursosregister", verCursos); 


router.use(authenticateJwt);
router.get("/profesor/email/:rut", isAuthorized("jefeUTP", "administrador"), getEmailByProfesor);
router.get("/curso/emails/:ID_curso", isAuthorized("jefeUTP", "administrador"), getEmailsByCurso);
router.post("/notificacion/profesor",isAuthorized("jefeUTP", "administrador"),sendNotificationToProfessor);
router.post("/notificacion/curso",isAuthorized("jefeUTP", "administrador"),sendNotificationToCourse);
router.get("/alumno", isAuthorized("alumno"), verHorarioByAlumno);
router.post("/asignar/curso", isAuthorized("jefeUTP", "administrador"), crearHorarioCurso);
router.post("/asignar/profesor", isAuthorized("jefeUTP", "administrador"), crearHorarioProfesor);
router.get("/cursos", isAuthorized("jefeUTP", "administrador", "profesor"), verCursos);
router.get("/profesores", isAuthorized("jefeUTP", "administrador", "profesor"), verProfesores);
router.post("/materias/crear", isAuthorized("jefeUTP", "administrador"), crearMateria);
router.post("/cursos/crear", isAuthorized("jefeUTP", "administrador"), crearCurso);
router.delete("/materias/eliminar/:ID_materia", isAuthorized("jefeUTP", "administrador"), eliminarMateria);
router.delete("/cursos/eliminar/:ID_curso", isAuthorized("jefeUTP", "administrador"), eliminarCurso);
router.get("/ver/curso/:ID_curso", isAuthorized("alumno", "profesor", "jefeUTP", "administrador"), verHorarioCurso);
router.get("/ver/profesor", isAuthorized("profesor", "jefeUTP", "administrador"), verHorarioProfesor);
router.delete("/eliminar/curso/:ID_horario", isAuthorized("jefeUTP", "administrador"), eliminarHorarioCurso);
router.delete("/eliminar/profesor/:rut", isAuthorized("jefeUTP", "administrador"), eliminarHorarioProfesor);




export default router; 
