import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { UsersService } from "src/users/users.service";
import type { Request } from "express"
@Injectable()
export class IsEmailBlocked implements NestInterceptor {
    constructor(private readonly usersService: UsersService) { }
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest<Request>();
        const user = await this.usersService.findOne(req.user?._id!);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        if (user.status === 'blocked') {
            throw new BadRequestException(
                'Your account is blocked. Please contact support.',
            );
        }
        return next.handle().pipe(map(dta => dta))
    }
}