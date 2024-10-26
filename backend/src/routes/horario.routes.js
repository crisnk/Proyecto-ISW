import express from 'express';
import { asignaHorario, modificaHorario, verHorario } from '../controllers/horarios.controller.js';
import { isAuthenticated, isAuthorized } from '../middlewares/auth.js';

const router = express.Router();

router.post('/asignar', isAuthenticated, isAuthorized('jefeUTP'), asignaHorario);

router.put('/modificar', isAuthenticated, isAuthorized('jefeUTP'), modificaHorario);

router.get('/ver', isAuthenticated, isAuthorized, verHorario);

export default router;
