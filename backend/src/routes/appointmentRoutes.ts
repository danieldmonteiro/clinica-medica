import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { createAppointment, getAppointments, cancelAppointment } from '../controllers/appointmentController';

const router = Router();

// Criar agendamento (precisa estar autenticado)
router.post('/', authMiddleware, createAppointment);

// Listar agendamentos
router.get('/', authMiddleware, getAppointments);

// Cancelar agendamento (precisa estar autenticado)
router.delete('/:id', authMiddleware, cancelAppointment);

export default router;
