import { IsEmail, IsString, MinLength, IsOptional, IsDate, IsIn } from 'class-validator';
import { IUserRequiredProperties } from '../types';
import { USER_ROLES } from '../constants';
import { PASSWORD_MIN_LENGTH, USER_STATUS, type UserStatus } from '../constants/users';
import { Types } from 'mongoose';

export class CreateUserDto implements IUserRequiredProperties {
    @IsOptional()
    _id: Types.ObjectId;

    @IsDate()
    createdAt: Date;

    @IsIn(USER_STATUS)
    status: UserStatus

    @IsIn(USER_ROLES)
    roles: string[];

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH)
    password: string;

    @IsString()
    name: string;

    @IsOptional()
    updatedAt: Date;
}
