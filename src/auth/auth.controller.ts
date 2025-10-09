import { BadRequestException, Controller, HttpException, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response, Request } from "express"
import { Post, Req, Res, Body } from "@nestjs/common"
import { SigninDto, SignupDto } from 'src/users/dtos';
import { AuthService } from './auth.service';
import { RateLimit } from 'nestjs-rate-limiter';
import { BruteforceProtection } from './guards';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }
    @Post("signup")
    async signup(@Body() userObj: SignupDto) {
        return this.authService.signup(userObj)
    }
    @RateLimit({
        points: 5,
        duration: 600,
        keyPrefix: 'signin',
        errorMessage:
            'Too many requests for login endpoint. Please wait a 10 minute and try again.',
    })
    @UseGuards(BruteforceProtection)
    @Post("signin")
    async signin(@Body() credentails: SigninDto, @Res({ passthrough: true }) response: Response, @Req() request: Request) {
        if (request.cookies.jwt) throw new BadRequestException('You are already logged in')
        const user = await this.authService.signin(credentails, request, response);
        return (user)
    }
    @Post('signout')
    async signout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('jwt');
        res.clearCookie('refreshToken');
        return { message: 'Signed out successfully' };
    }
}
