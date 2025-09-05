import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Usuário já existe' });

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = new User({
      nome,
      email,
      senha: hashedPassword,
      role
    });

    await user.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido' });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) return res.status(400).json({ message: 'Senha inválida' });

    const token = jwt.sign({ id: user._id, nome: user.nome }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

    res.json({ message: 'Login realizado com sucesso', token, userId: user._id, nome: user.nome });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido' });
    }
  }
};
