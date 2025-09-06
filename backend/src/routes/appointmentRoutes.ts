import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { createAppointment, getAppointments, cancelAppointment } from '../controllers/appointmentController';

const router = Router();

// Criar agendamento

router.post('/', authMiddleware, createAppointment);

// Listar agendamentos

router.get('/', authMiddleware, getAppointments);

// Cancelar agendamento

router.delete('/:id', authMiddleware, cancelAppointment);

export default router;
