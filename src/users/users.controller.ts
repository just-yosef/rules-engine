import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos';
import { ExecludePassword, IsAdmin } from 'src/auth/interceptors';
import { EmailConfirmedGuard, IsLoggedIn } from 'src/auth/guards';
import { CurrentUser } from './decorators';
import { IUserRequiredProperties } from './types';
import type { Request } from 'express';
import { RateLimiterGuard, RateLimit } from 'nestjs-rate-limiter';

@UseInterceptors(ExecludePassword)
@UseGuards(RateLimiterGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(IsLoggedIn)
    @RateLimit({
        points: 3,
        duration: 60,
        errorMessage: 'You can verify your email again after 1 minute',
        keyPrefix: 'verify-email',
    })
    @Patch('/verify-my-email')
    async verifyEmail(
        @CurrentUser() { id }: Pick<IUserRequiredProperties, 'id'>,
    ) {
        return this.usersService.verifyEmail(id!);
    }

    @UseGuards(IsLoggedIn)
    @UseInterceptors(IsAdmin)
    @RateLimit({
        points: 3,
        duration: 600,
        errorMessage: 'Can not reach this endpoint for 10 minutes',
        keyPrefix: 'get-all-users',
    })
    @Get()
    async getAllUsers() {
        return this.usersService.findAll();
    }

    @Get('/:id')
    async getUser(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @UseGuards(IsLoggedIn)
    @RateLimit({
        points: 3,
        duration: 60,
        errorMessage: 'Please try again later',
        keyPrefix: 'verify-otp',
    })
    @Post('/verify/:otp')
    async verifyOtp(@Param('otp') otp: string, @Req() req: Request) {
        return this.usersService.verifyOtp(otp, req.user!);
    }

    @UseGuards(IsLoggedIn)
    @UseInterceptors(IsAdmin)
    @Patch('/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
    ) {
        return this.usersService.updateUser(id, dto);
    }
}
