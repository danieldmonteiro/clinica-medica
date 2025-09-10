import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import appointmentRoutes from './routes/appointmentRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares

app.use(cors());
app.use(express.json());

// Rotas

app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

// Conexão com MongoDB e inicialização do servidor

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
      app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
    })
    // .catch(err => console.error(err));
    .catch((err: unknown) => {
  if (err instanceof Error) {
    console.error("Erro:", err.message);
  } else {
    console.error("Erro desconhecido:", err);
  }
  });