import { IsEmail, IsString, MinLength, IsOptional, IsDate, IsIn } from 'class-validator';
import { IUserRequiredProperties } from '../types';
import { USER_ROLES } from '../constants';
import { PASSWORD_MIN_LENGTH, USER_STATUS, type UserRole, type UserStatus } from '../constants/users';
import { Types } from 'mongoose';
import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class CreateUserDto implements IUserRequiredProperties {
    @IsOptional()
    _id: string;

    @Expose()
    @IsDate()
    createdAt: Date;
    @Expose()

    @IsIn(USER_STATUS)
    status: UserStatus
    @Expose()

    @IsIn(USER_ROLES)
    roles: string[]
    @Expose()

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH)
    password: string;
    @Expose()

    @IsString()
    name: string;

    @IsOptional()
    updatedAt: Date;
}
