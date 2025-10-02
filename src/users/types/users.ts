import { Types } from "mongoose";
import { UserRole } from "../constants/users";

type UserSegment =
    | "new_user"
    | "loyal_customer"
    | "vip"
    | "churned"
    | "guest";
type UserStatus = "active" | "pending" | "blocked"
interface IUserProfile {
    phone?: string;
    age?: number;
    segment?: UserSegment;
    avatarUrl?: string;
}
interface IUserRequiredProperties {
    email: string;
    password: string;
    roles: string[]
    name: string;
    status?: UserStatus;
    createdAt?: Date;
    updatedAt?: Date;
    id?: string
}
interface SecurityProperties {
    refreshToken?: string;
    failedLoginAttempts?: number;
    lastLoginAt?: Date; // compute it when io server is closed 
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string;
}
interface IUser extends IUserProfile, IUserRequiredProperties, SecurityProperties { }

export type {
    IUser
    , IUserProfile,
    IUserRequiredProperties,
    SecurityProperties,
    UserSegment
}