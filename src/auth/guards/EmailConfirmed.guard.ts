import { CanActivate, ExecutionContext, Injectable, ForbiddenException, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { UnauthorizeException } from '../exceptions/Unauthorize.exception';

@Injectable()
export class EmailConfirmedGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user;
        if (!user) {
            throw new ForbiddenException('User not found in request');
        }
        if (!user.isVerify) {
            throw new UnauthorizeException('Email is not confirmed');
        }
        return true;
    }
}
