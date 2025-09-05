import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    nome: string;
    email: string;
    senha: string;
    role: 'paciente' | 'secretario';
}

const userSchema = new Schema<IUser>({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    role: { type: String, enum: ['paciente', 'secretario'], default:
'paciente' }
});

export default model<IUser>('user', userSchema);