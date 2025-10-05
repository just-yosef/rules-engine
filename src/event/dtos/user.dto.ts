import { IsEmail, IsEnum, IsIn, IsNumber, IsOptional, IsString } from "class-validator";
import type { UserStatus } from "../users/types";

export class UserDto {
    @IsString()
    userId: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    age?: number;

    @IsOptional()
    @IsEnum(["vip", "regular", "new"], {
        message: "segment must be one of: vip, regular, new",
    })
    segment?: "vip" | "regular" | "new";

    @IsIn(["active", "inactive", "banned"], {
        message: "status must be one of: active, inactive, banned",
    })
    status: UserStatus
}
