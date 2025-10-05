import { BadRequestException, CallHandler, ExecutionContext, forwardRef, Inject, Injectable, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

import { UsersService } from "src/users/users.service";
import { decodeJWT } from "src/users/utils";
@Injectable()
export class IsAdmin implements NestInterceptor {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler) {
        try {
            const req = context.switchToHttp().getRequest<Request>();
            const decodedToken = decodeJWT(req.cookies.jwt)
            const user = await this.usersService.findOne(decodedToken?.id);
            if (!user.roles.includes('admin')) {
                throw new UnauthorizedException("Unauthorize to enter this route")
            }
            return next.handle()
        } catch (error) {
            throw new BadRequestException(error.message || "Unknown Error")
        }
    }
}