import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Appointment from '../models/appointment';
import { obterPrevisaoClima } from '../services/weatherService';
import user from '../models/user';

// Criar agendamento

export const createAppointment = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = (req as any).userId;
    const { data, duration, descricao } = req.body;

    if (!data || !duration || !descricao) {
      await session.abortTransaction();
      // session.endSession();
      return res.status(400).json({ message: 'Data, duração e descrição são obrigatórios' });
    }

    const currentUser = await user.findById(userId).session(session);
    if (!currentUser) {
      await session.abortTransaction();
      // session.endSession();
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (!currentUser.address || !currentUser.address.localidade) {
      await session.abortTransaction();
      // session.endSession();
      return res.status(400).json({ message: 'Endereço do usuário necessário para obter clima' });
    }

    const start = new Date(data);
    const end = new Date(start.getTime() + duration * 60 * 1000);

    // Verificar se a data é no passado

    if (start < new Date()) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Não é possível agendar consultas no passado' });
    }

    // Checar conflito de horários (independente do usuário)

    const conflict = await Appointment.findOne({
      data: {
        $lt: end,
        $gt: new Date(start.getTime() - duration * 60 * 1000)
      }
    }).session(session);

    if (conflict) {
      await session.abortTransaction();
      return res.status(409).json({ message: 'Horário já reservado' });
    }

    // Checar conflito de horários (mesmo usuário)

    // const conflict = await Appointment.findOne({
    //   paciente: currentUser._id,
    //   data: {
    //     $lt: end,
    //     $gt: new Date(start.getTime() - duration * 60 * 1000)
    // }
    // }).session(session);

    // if (conflict) {
    //   await session.abortTransaction();
    //   // session.endSession();
    //   return res.status(409).json({ message: 'Horário já reservado' });
    // }
    
    // Obter previsão do clima usando o serviço

    let previsaoClima = 'Indisponível';
    try {
      previsaoClima = await obterPrevisaoClima(currentUser.address.cep, start);
    } catch (err) {
      console.error('Erro ao obter previsão do clima:', err);
    }

    const appointment = await Appointment.create([{
      paciente: currentUser._id,
      endereco: currentUser.address.cep, // ou objeto completo se schema permitir
      data: start,
      start,
      end,
      duration,
      descricao,
      previsaoClima
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Consulta agendada com sucesso',
      appointment: appointment[0]
    });

  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Listar agendamentos (por ordem de entrada)

// export const getAppointments = async (_req: Request, res: Response) => {
//   try {
//     const appointments = await Appointment.find();
//     res.json(appointments);
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ message: err.message });
//     } else {
//       res.status(500).json({ message: 'Erro desconhecido' });
//     }
//   }
// };

// Listar agendamentos (ordenados por data)

export const getAppointments = async (_req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find().sort({ data: 1 }); // 1 = crescente, -1 = decrescente
    res.json(appointments);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido' });
    }
  }
};

// Cancelar agendamento

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const deleted = await Appointment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    return res.status(204).send(); // sucesso, sem corpo
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};