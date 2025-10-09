import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { SessionService } from "src/session/session.service";
import { UsersService } from "src/users/users.service";
import { getUserIP } from "../helpers";
import { JWT_EXPIRESS_OPTIONS } from "src/users/constants";
import { signJWT } from "src/users/utils";
import { setJwtCookie } from "../utils";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { CacheKeys } from "../constants";
import { UserInRequest } from "src/users/types";



@Injectable()
export class VerifySession implements NestMiddleware {
    constructor(
        private readonly sessionService: SessionService,
        private readonly usersService: UsersService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) { }
    async use(req: Request, res: Response, next: (error?: any) => void) {
        const cachedUserSessions = await this.cacheManager.get<[]>(CacheKeys.user_sessions)
        const userSessions = cachedUserSessions || await this.sessionService.getUserSessions(req.user?._id!);
        await this.cacheManager.set(CacheKeys.user_sessions, userSessions,)
        const cachedUser = await this.cacheManager.get<UserInRequest>(CacheKeys.currentUser)
        const user = cachedUser || await this.usersService.findOne(req.user?._id!) as UserInRequest
        await this.cacheManager.set(CacheKeys.currentUser, user, 300)
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