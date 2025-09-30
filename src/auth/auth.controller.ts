import { BadRequestException, Controller, HttpException } from '@nestjs/common';
import type { Response, Request } from "express"
import ms, { StringValue } from "ms"

import { Post, Req, Res, Session, Body } from "@nestjs/common"
import { SigninDto, SignupDto } from 'src/users/dtos';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }
    @Post("signup")
    async signup(@Body() userObj: SignupDto) {
        return this.authService.signup(userObj);
    }
    @Post("signin")
    async signin(@Body() credentails: SigninDto, @Res({ passthrough: true }) response: Response, @Req() request: Request) {
        try {
            const user = await this.authService.signin(credentails);
            response.cookie("jwt", user.token, { maxAge: ms(process.env.TOKEN_EXPIRATION! as StringValue) })
            response.cookie("refreshToken", user.refreshToken, { maxAge: ms(process.env.REFRESH_TOKEN_EXPIRATION! as StringValue) })
            return (user)
        } catch (error) {
            throw new BadRequestException(error,)
        }
    }

    @Post('signout')
    async signout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('jwt');
        res.clearCookie('refreshToken');
        return { message: 'Signed out successfully' };
    }
}
