import { BadRequestException, Controller, forwardRef, HttpException, Inject } from '@nestjs/common';
import type { Response, Request } from "express"
import ms, { StringValue } from "ms"

import { Post, Req, Res, Session, Body } from "@nestjs/common"
import { SigninDto, SignupDto } from 'src/users/dtos';
import { AuthService } from './auth.service';
import { setAuthCookies } from './utils';
import { UsersService } from 'src/users/users.service';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService

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
        // Block this user if attempts > 10
        if (+cookies["login-attempts"] >= 10) {
            return this.usersService.blockUser(credentails.email)
        };
        const user = await this.authService.signin(credentails);
        setAuthCookies(response, user.token, user.refreshToken)
        return (user)

    }

    @Post('signout')
    async signout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('jwt');
        res.clearCookie('refreshToken');
        return { message: 'Signed out successfully' };
    }
}
