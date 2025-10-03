import { Schema, model, Types, } from 'mongoose';
import { USER_ROLES, USER_STATUS } from './constants';
import { IUserRequiredProperties, SecurityProperties } from './types';

export interface IUserDocument extends IUserRequiredProperties, SecurityProperties { }

export const UserSchema = new Schema<IUserDocument>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], required: true, enum: USER_ROLES, default: ['user'] },
    status: { type: String, required: true, enum: USER_STATUS, default: 'pending' },
    name: { type: String },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
    isVerify: { type: Boolean, default: false },
    otp: { type: String, default: undefined },

}, { timestamps: true });

export const UserModel = model<IUserDocument>('User', UserSchema);
