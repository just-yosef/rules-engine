import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors, } from '@nestjs/common';
import { UsersService } from "./users.service"
import { UpdateUserDto, UpdateVerifyDto } from './dtos';
import { ExecludePassword, IsAdmin } from 'src/auth/interceptors';
import { EmailConfirmedGuard, IsLoggedIn } from 'src/auth/guards';
import { CurrentUser } from './decorators';
import { IUserRequiredProperties } from './types';
import type { IUserDocument } from './user.model';
import type { Request } from 'express';
import { RateLimiterGuard, RateLimit } from 'nestjs-rate-limiter';


@UseInterceptors(ExecludePassword)
@UseGuards(RateLimiterGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }
    @UseGuards(IsLoggedIn)
    @Patch("/verify-my-email")
    async verifyEmail(
        @CurrentUser() { id }: Pick<IUserRequiredProperties, "id">
    ) {
        return this.usersService.verifyEmail(id!);
    }
    @RateLimit({ points: 3, errorMessage: "can not reach this endpoint for a 10 mins", duration: 600 })
    @UseGuards(IsLoggedIn)
    @UseInterceptors(IsAdmin)
    @Get()
    async getAllUsers() {
        return this.usersService.findAll()
    }

    @Get('/:id')
    async getUser(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Post('/verify/:otp')
    async verifyOtp(@Param('otp') otp: string, @Req() req: Request) {
        return this.usersService.verifyOtp(otp, req.user!);
    }

    @Patch("/:id")
    async updateUser(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
    ) {
        return this.usersService.updateUser(id, dto);
    }

}