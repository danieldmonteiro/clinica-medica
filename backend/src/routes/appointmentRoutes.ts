import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { createAppointment, getAppointments } from '../controllers/appointmentController';

const router = Router();

// Criar agendamento (precisa estar autenticado)
router.post('/', authMiddleware, createAppointment);

// Listar agendamentos
router.get('/', authMiddleware, getAppointments);

export default router;
