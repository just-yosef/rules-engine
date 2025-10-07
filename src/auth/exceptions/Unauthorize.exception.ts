import { HttpException, HttpStatus } from "@nestjs/common";

export class UnauthorizeException extends HttpException {
    msg: string
    constructor(msg?: string) {
        super(msg || "Unauthorize to enter this route", HttpStatus.UNAUTHORIZED)
        this.msg = msg || "Unauthorize to enter this route"
    }
}