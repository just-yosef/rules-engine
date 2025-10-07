import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { decodeJWT } from 'src/users/utils';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class IsLoggedInMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) { }
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies?.jwt;
            if (!token) {
                throw new UnauthorizedException('You must be logged in');
            }
            const decoded = decodeJWT(token);
            if (!decoded?.id) {
                throw new UnauthorizedException('Invalid token');
            }
            const user = await this.usersService.findOne(decoded.id);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            req.user = user;
            next();
        } catch (err) {
            throw new UnauthorizedException(err.message || 'Not authorized');
        }
    }
}
