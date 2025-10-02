import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

import { ExcludePassword } from "../../users/dtos"
import { instanceToPlain, plainToInstance, } from "class-transformer";
@Injectable()
export class ExecludePassword implements NestInterceptor {
    intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(map((data) => plainToInstance(ExcludePassword, data, { excludeExtraneousValues: true })))
    }
}