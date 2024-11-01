import { Router } from "express";
import {
    crearHorario,
    eliminarHorario,
    modificarHorario,
    verHorarioCurso,
    verHorarioProfesor,
    verTodosHorarios
    
} from "../controllers/horarios.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import isAuthorized from "../middlewares/authorization.middleware.js";
import { validateHorario } from "../middlewares/validateHorario.js";

const router = Router();

router.use(authenticateJwt);


router.post("/asignar", isAuthorized(["jefeUTP"]), validateHorario, crearHorario);
router.patch("/modificar/:id", isAuthorized(["jefeUTP"]), validateHorario, modificarHorario);


router.delete("/eliminar/:id", isAuthorized(["jefeUTP"]), eliminarHorario);
router.get("/ver/profesor", isAuthorized(["profesor", "jefeUTP"]), verHorarioProfesor);
router.get("/ver/curso/:ID_curso", isAuthorized(["alumno", "profesor", "jefeUTP"]), verHorarioCurso);
router.get("/ver/todos", isAuthorized(["jefeUTP", "profesor"]), verTodosHorarios);

export default router;
