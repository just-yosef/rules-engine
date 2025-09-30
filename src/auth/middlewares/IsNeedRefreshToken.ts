import { BadRequestException, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";

import {
    Request, Response, NextFunction
} from "express"
import { verifyJWT, signJWT } from "src/users/utils";
import type { IUserRequiredProperties } from "../../users/types"
import { UsersService } from "src/users/users.service";
import ms, { StringValue } from "ms";

type user = Pick<IUserRequiredProperties, "email" | "name" | "id">

@Injectable()
export class IsNeedRefreshToken implements NestMiddleware {
    constructor(private readonly usersService: UsersService) { }
    async use(req: Request, res: Response, next: NextFunction) {
        const { jwt, refreshToken } = req.cookies;
        if (!jwt && !refreshToken) throw new UnauthorizedException("please login")
        if (refreshToken && !jwt) {
            try {
                const verifyToken = verifyJWT(refreshToken) as user;
                const user = await this.usersService.findOne(verifyToken.id!);
                const newJWT = signJWT({
                    email: user.email,
                    id: user.id
                }, {
                    expiresIn: process.env.TOKEN_EXPIRATION! as StringValue
                })
                const newRefreshJWT = signJWT({
                    email: user.email,
                    id: user.id
                }, {
                    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION! as StringValue
                })
                res.cookie("jwt", newJWT, {
                    httpOnly: true,
                    maxAge: ms(process.env.TOKEN_EXPIRATION! as StringValue),
                });
                res.cookie("refreshToken", newRefreshJWT, {
                    httpOnly: true,
                    maxAge: ms(process.env.REFRESH_TOKEN_EXPIRATION! as StringValue),
                });
                return next()
            } catch (error) {
                throw new BadRequestException(error.message)
            }
        }
        next()
    }
}
