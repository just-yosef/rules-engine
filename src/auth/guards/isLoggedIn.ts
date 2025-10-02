import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class IsLoggedIn implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const { cookies } = context.switchToHttp().getRequest<Request>();
        console.log(cookies.jwt);
        return !!cookies.jwt
    }
}