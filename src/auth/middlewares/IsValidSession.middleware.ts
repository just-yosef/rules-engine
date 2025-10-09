import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { SessionService } from "src/session/session.service";



@Injectable()
export class IsValidSession implements NestMiddleware {
    constructor(
        private readonly sessionService: SessionService
    ) { }
    async use(req: Request, res: Response, next: (error?: any) => void) {
        const { cookies } = req;
        const token = cookies.jwt
        const currentSession = await this.sessionService.getSessionsByToken(token);
        if (!currentSession) return res.json({ status: 401, message: "session expired" })
        next()
    }
}