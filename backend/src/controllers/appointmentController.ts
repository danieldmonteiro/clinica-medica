import { Request, Response } from 'express';
import Appointment from '../models/appointment';
import { obterPrevisaoClima } from '../services/weatherService';

export const createAppointment = async (req: Request, res: Response) => {
  try {
    // Pega o userId diretamente do token JWT decodificado pelo middleware
    const paciente = (req as any).userId;

    const { data, endereco, descricao } = req.body;

    if (!data || !endereco || !descricao) {
      return res.status(400).json({ message: 'Data, endereço e descrição são obrigatórios' });
    }

    // Chama o serviço de previsão do clima
    // const previsaoClima = await obterPrevisaoClima(endereco, new Date(data));

    let previsaoClima = 'Indisponível';
    try {
      previsaoClima = await obterPrevisaoClima(endereco, new Date(data));
    } catch (err) {
      console.error('Erro ao buscar previsão do clima:', err);
    }

    const appointment = new Appointment({
      paciente,
      data,
      endereco,
      descricao,
      previsaoClima
    });

    await appointment.save();
    res.status(201).json({
      message: 'Consulta agendada com sucesso',
      appointment
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido' });
    }
  }
};

export const getAppointments = async (_req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido' });
    }
  }
};

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

// import { Request, Response } from 'express';
// import Appointment from '../models/appointment';
// import { obterPrevisaoClima } from '../services/weatherService';

// export const createAppointment = async (req: Request, res: Response) => {
//   try {
//     const { paciente, data, endereco } = req.body;

//     const previsaoClima = await obterPrevisaoClima(endereco, new Date(data));

//     const appointment = new Appointment({
//       paciente,
//       data,
//       endereco,
//       previsaoClima
//     });

//     await appointment.save();
//     res.status(201).json(appointment);
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ message: err.message });
//     } else {
//       res.status(500).json({ message: 'Erro desconhecido' });
//     }
//   }
// };

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
