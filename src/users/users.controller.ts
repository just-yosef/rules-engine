import { Body, Controller, Get, Post, Req, Session } from '@nestjs/common';
import { SigninDto, SignupDto } from './dtos';
import { UsersService } from "./users.service"

@Controller('/auth/users')

export class UsersController {
    constructor(
        private readonly userService: UsersService
    ) { }
    @Get()
    async getAllUsers() {
        return this.userService.findAll()
    }
    @Post("signup")
    async signup(@Body() userObj: SignupDto) {
        return this.userService.signup(userObj);
    }
    @Post("signin")
    async signin(@Body() credentails: SigninDto) {
        const user = await this.userService.signin(credentails);
        return user;
    }
}