import { Injectable, NestMiddleware, } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { getUserIP } from '../helpers';

@Injectable()
export class AssignUserIP implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const ip = await getUserIP();
        console.log("IP: ",ip);
        if(req.user) {
            req!.user!.ip = ip
        }
        next()
    }
}
