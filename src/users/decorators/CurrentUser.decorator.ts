import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { decodeUserFromToken } from 'src/auth/utils';

export const CurrentUser = createParamDecorator(
    (_: never, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'] || request.cookies['jwt'];
        if (!authHeader) throw new UnauthorizedException('No token provided');
        try {
            const user = decodeUserFromToken(authHeader);
            return user;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    },
);
