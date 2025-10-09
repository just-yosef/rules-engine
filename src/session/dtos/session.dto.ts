import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsMongoId,
    IsBoolean,
    IsDateString,
} from 'class-validator';

export class CreateSessionDto {
    @IsMongoId({ message: 'userId must be a valid Mongo ObjectId' })
    @IsNotEmpty({ message: 'userId is required' })
    userId: string;

    @IsString({ message: 'token must be a string' })
    @IsNotEmpty({ message: 'token is required' })
    token: string;

    @IsOptional()
    @IsString({ message: 'ipAddress must be a string' })
    ipAddress?: string;

    @IsOptional()
    @IsString({ message: 'location must be a string' })
    location?: string;

    @IsOptional()
    @IsDateString({}, { message: 'expiresAt must be a valid ISO date string' })
    expiresAt?: string;
}
