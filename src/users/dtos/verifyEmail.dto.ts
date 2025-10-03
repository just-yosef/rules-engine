import { IsBoolean } from 'class-validator';

export class UpdateVerifyDto {
    @IsBoolean()
    isVerify: boolean;
}
