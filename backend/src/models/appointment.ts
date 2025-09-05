import { Schema, model, Document } from 'mongoose';

export interface IAppointment extends Document {
    paciente: string;
    data: Date;
    endereco: string;
    previsaoClima?: string;
}

const appointmentSchema = new Schema<IAppointment>({
    paciente: { type: String, required: true },
    data: { type: Date, required: true },
    endereco: { type: String, required: true },
    previsaoClima: { type: String }
});

export default model<IAppointment>('Appointment', appointmentSchema);
