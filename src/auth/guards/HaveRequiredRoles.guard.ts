import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import type { Request } from 'express'
import { UnauthorizeException } from "../exceptions/Unauthorize.exception";
@Injectable()
export class HaveRequiredRoles implements CanActivate {
    constructor(
        private reflector: Reflector
    ) { }
    canActivate(context: ExecutionContext): any {
        const req = context.switchToHttp().getRequest<Request>();
        const roles = this.reflector.get<string[]>("roles", context.getHandler())
        const userRoles = new Set(req.user?.roles);
        const haveAccessToContinue = roles.every(item => userRoles.has(item.toLowerCase()))
        if (!haveAccessToContinue) throw new UnauthorizeException()
        return true
    }
}