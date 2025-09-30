import { IsOptional, IsString, IsEmail, MinLength, IsIn } from 'class-validator';
import { USER_ROLES, USER_STATUS } from '../constants';
import type { UserStatus } from '../constants/users';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @MinLength(6)
    password?: string;

    @IsOptional()
    @IsIn(USER_STATUS)
    status: UserStatus

    @IsOptional()
    @IsIn(USER_ROLES)
    roles: string[];

}