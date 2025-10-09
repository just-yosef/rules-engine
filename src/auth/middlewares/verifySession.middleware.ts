import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { SessionService } from "src/session/session.service";
import { UsersService } from "src/users/users.service";
import { getUserIP } from "../helpers";
import { JWT_EXPIRESS_OPTIONS } from "src/users/constants";
import { signJWT } from "src/users/utils";
import { setJwtCookie } from "../utils";



@Injectable()
export class VerifySession implements NestMiddleware {
    constructor(
        private readonly sessionService: SessionService,
        private readonly usersService: UsersService
    ) { }
    async use(req: Request, res: Response, next: (error?: any) => void) {
        const userSessions = await this.sessionService.getUserSessions(req.user?._id!);
        const user = await this.usersService.findOne(req.user?._id!)
        console.log("user sessions: ", userSessions, req.user);
        let token = signJWT({ id: user._id, email: user.email, roles: user.roles, isVerify: user.isVerify })
        const ip = await getUserIP()
        if (userSessions.length > 1) {
            // remove all old sessions
            await this.sessionService.deleteSessionsByUserId(req.user?._id!);
            // create new session
            await this.sessionService.createSession({
                token,
                userId: req.user?._id!,
                ipAddress: ip,
                expiresAt: JWT_EXPIRESS_OPTIONS.expiresIn
            })
            setJwtCookie(res, token)
            return next()
        }
        next()
    }
}