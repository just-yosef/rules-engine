import {
    BadRequestException,
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyJWT, signJWT } from 'src/users/utils';
import { UsersService } from 'src/users/users.service';
import { StringValue } from 'ms';
import { setAuthCookies } from '../utils';
import type { IUserRequiredProperties, UserInRequest } from 'src/users/types';
import { UnauthorizeException } from '../exceptions/Unauthorize.exception';

type DecodedUser = Pick<IUserRequiredProperties, 'email' | 'name' | 'id' | 'isVerify'>;

declare module 'express' {
    interface Request {
        user?: UserInRequest;
    }
}

@Injectable()
export class IsNeedRefreshToken implements NestMiddleware {
    constructor(private readonly usersService: UsersService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const { jwt, refreshToken } = req.cookies;
        if (!refreshToken && !jwt) return next()
        if (refreshToken) {
            try {
                const verifyToken = verifyJWT(refreshToken) as DecodedUser;
                const user = await this.usersService.findOne(verifyToken.id!);
                if (!user) throw new UnauthorizeException('user not found');
                req.user = user;
                if (!jwt) {
                    const newJWT = signJWT(
                        { email: user.email, id: user._id },
                        { expiresIn: process.env.TOKEN_EXPIRATION! as StringValue },
                    );
                    const newRefreshJWT = signJWT(
                        { email: user.email, id: user._id },
                        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION! as StringValue },
                    );
                    setAuthCookies(res, newJWT, newRefreshJWT);
                }
                return next();
            } catch (error) {
                throw new BadRequestException(error.message || 'Invalid token');
            }
        }
        next();
    }
}
