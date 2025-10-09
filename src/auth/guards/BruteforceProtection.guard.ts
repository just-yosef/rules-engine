import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { setCookie } from "../utils";
import { Request, Response } from "express";
import ms from "ms";
import { UsersService } from "src/users/users.service";
import { EmailsService } from "src/emails/emails.service";
import { IUserRequiredProperties } from "src/users/types";


type signinBody = Pick<IUserRequiredProperties, "email" | "password">

@Injectable()
export class BruteforceProtection implements CanActivate {
    constructor(
        private usersService: UsersService,
        private emailService: EmailsService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>()
        const res = context.switchToHttp().getResponse<Response>()
        const user = await this.usersService.findUserByName((req.body as signinBody).email)
        if (!user) return false
        if (req.user) return true
        let loginTimes = Number(req.cookies["login-times"] || 0);
        setCookie(res, ++loginTimes + "", "login-times", ms('10m'))
        if (loginTimes === 10) {
            await this.usersService.blockUser(user.email);
            await this.emailService.sendEmail({
                message: "Your account has been temporarily suspended due to multiple failed login attempts. Please contact support to restore access",
                toEmail: user.email
            })
            res.clearCookie(`login-times`);
            throw new BadRequestException("Your Account Has Been Suspended")
        }
        return true
    }
}