import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import axios from 'axios';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, role } = req.body;

    // Verifica se o usuário já existe

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Usuário já existe' });

    // Hash da senha

    const hashedPassword = await bcrypt.hash(senha, 10);

    // Validar role

    const userRole = ['paciente', 'secretario'].includes(role) ? role : 'paciente';

    // Preencher endereço via ViaCEP

    let fullAddress;
    if (req.body.address?.cep) {
      const cep = String(req.body.address.cep).replace(/\D/g, '');
      try {
        const viacepRes = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (viacepRes.data.erro) {
          return res.status(400).json({ message: 'CEP inválido' });
        }
        fullAddress = {
          ...req.body.address,
          logradouro: viacepRes.data.logradouro,
          complemento: viacepRes.data.complemento,
          bairro: viacepRes.data.bairro,
          localidade: viacepRes.data.localidade,
          uf: viacepRes.data.uf,
          cep
        };
      } catch (error) {
        console.error('Erro ao consultar ViaCEP:', error);
        return res.status(500).json({ message: 'Erro ao consultar ViaCEP' });
      }
    }

    // Criar usuário

    const user = new User({
      nome,
      email,
      senha: hashedPassword,
      role: userRole,
      address: fullAddress
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

    res.json({ message: 'Login realizado com sucesso', token, userId: user._id, nome: user.nome, role: user.role,
      address: user.address });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido' });
    }
  }
};
