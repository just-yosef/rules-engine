import { BadRequestException, Controller, forwardRef, HttpException, Inject } from '@nestjs/common';
import type { Response, Request } from "express"
import ms, { StringValue } from "ms"

import { Post, Req, Res, Session, Body } from "@nestjs/common"
import { SigninDto, SignupDto } from 'src/users/dtos';
import { AuthService } from './auth.service';
import { setAuthCookies } from './utils';
import { UsersService } from 'src/users/users.service';
import { EventService } from 'src/event/event.service';
import { IsValidEvent } from 'src/event/decorators';
import { UserDto } from 'src/event/dtos';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly eventService: EventService
    ) { }
    @Post("signup")
    async signup(@Body() userObj: SignupDto) {
        return this.authService.signup(userObj);
    }
    @Post("signin")
    async signin(
        @Body() credentails: SigninDto,
        @Res({ passthrough: true }) response: Response,
        @Req() request: Request,
    ) {
        let loginAttempts = request.cookies["login-attempts"] || 1
        response.cookie("login-attempts", ++loginAttempts, { maxAge: ms("10m") })
        const cookies = request.cookies;
        if (+cookies["login-attempts"] >= 10) {
            return this.usersService.blockUser(credentails.email)
        };
        const { token, refreshToken, user: { email, _id, status, name, } } = await this.authService.signin(credentails);
        setAuthCookies(response, token, refreshToken);
        await this.eventService.create({
            service: "users", eventName: "user_logged_in", data: {
                userId: _id,
                email,
                status
            } as UserDto
        })
        return { email, name, token, refreshToken }
    }

    @Post('signout')
    async signout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('jwt');
        res.clearCookie('refreshToken');
        return { message: 'Signed out successfully' };
    }
}
