import { BadRequestException, Injectable, NestMiddleware, } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { getUserIP } from '../helpers';

@Injectable()
export class AssignUserIP implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        if (req.user) {
            if (req.user?.status === "blocked") {
                throw new BadRequestException("Your Account Has Been Suspended")
            }
        }
        next()
    }
}
