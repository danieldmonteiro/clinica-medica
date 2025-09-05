import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/userController';

const router = Router();

// Cadastro de usuário
router.post('/register', registerUser);

// Login de usuário
router.post('/login', loginUser);

export default router;
