import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { verifyJWT } from 'src/users/utils';
import type { Request } from 'express';

@Injectable()
export class IsLoggedIn implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const { jwt } = req.cookies;

    if (!jwt) throw new UnauthorizedException('No token found');

    try {
      const user = verifyJWT(jwt); 
      req.user = user as any; 
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
