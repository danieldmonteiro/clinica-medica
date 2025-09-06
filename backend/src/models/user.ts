import { Schema, model, Document } from 'mongoose';

export interface Address {
    cep: string;
    logradouro?: string;
    complemento?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
    numero?: string;
    lat?: number;
    lon?: number;
}

export interface IUser extends Document {
    nome: string;
    email: string;
    senha: string;
    role: 'paciente' | 'secretario';
    address?: Address;
}

const AddressSchema = new Schema<Address>({
    cep: { type: String, required: true },
    logradouro: String,
    complemento: String,
    bairro: String,
    localidade: String,
    uf: String,
    numero: String,
    lat: Number,
    lon: Number
}, { _id: false });

const userSchema = new Schema<IUser>({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    role: { type: String, enum: ['paciente', 'secretario'], default: 'paciente' },
    address: { type: AddressSchema, required: true }
});

export default model<IUser>('user', userSchema);