import { Router } from "express";
import {
  crearCurso,
  crearHorarioCurso,
  crearHorarioProfesor,
  crearMateria,
  verEmailProfesor, 
  verEmailsCurso ,
  verMaterias,
  verProfesores,
  verCursos,
  verHorarioAlumno,
  verHorarioCurso,
  verHorarioProfesor,
  NotificationCurso,
  NotificationProfesor ,
  eliminarHorarioCurso,
  eliminarCurso,
  eliminarHorarioProfesor,
  eliminarMateria,
  exportarHorario  
} from "../controllers/horarios.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import isAuthorized from "../middlewares/authorization.middleware.js";

const router = Router();

router.get("/materias", verMaterias);
router.get("/cursosregister", verCursos); 


router.use(authenticateJwt);
router.post("/notificacion/profesor",isAuthorized("jefeUTP", "administrador"), NotificationProfesor);
router.post("/notificacion/curso",isAuthorized("jefeUTP", "administrador"), NotificationCurso);
router.post("/materias/crear", isAuthorized("jefeUTP", "administrador"), crearMateria);
router.post("/cursos/crear", isAuthorized("jefeUTP", "administrador"), crearCurso);
router.post("/asignar/curso", isAuthorized("jefeUTP", "administrador"), crearHorarioCurso);
router.post("/asignar/profesor", isAuthorized("jefeUTP", "administrador"), crearHorarioProfesor);
router.get("/exportar/:type/:identifier", isAuthorized("jefeUTP", "administrador", "profesor", "alumno"), exportarHorario);
router.get("/profesor/email/:rut", isAuthorized("jefeUTP", "administrador"), verEmailProfesor);
router.get("/curso/emails/:ID_curso", isAuthorized("jefeUTP", "administrador"), verEmailsCurso);
router.get("/alumno", isAuthorized("alumno"), verHorarioAlumno);
router.get("/cursos", isAuthorized("jefeUTP", "administrador", "profesor"), verCursos);
router.get("/profesores", isAuthorized("jefeUTP", "administrador", "profesor"), verProfesores);
router.get("/ver/curso/:ID_curso", isAuthorized("profesor", "jefeUTP", "administrador"), verHorarioCurso);
router.get("/ver/profesor", isAuthorized("profesor", "jefeUTP", "administrador"), verHorarioProfesor);
router.delete("/eliminar/curso/:ID_curso/:dia/:bloque", isAuthorized("jefeUTP", "administrador"), eliminarHorarioCurso);
router.delete("/eliminar/profesor/:rut", isAuthorized("jefeUTP", "administrador"), eliminarHorarioProfesor);
router.delete("/materias/eliminar/:ID_materia", isAuthorized("jefeUTP", "administrador"), eliminarMateria);
router.delete("/cursos/eliminar/:ID_curso", isAuthorized("jefeUTP", "administrador"), eliminarCurso);




export default router; 
