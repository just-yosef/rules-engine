import { HttpException, HttpStatus } from "@nestjs/common";

export class UnauthorizeException extends HttpException {
    constructor() {
        super("Unauthorize to enter this route", HttpStatus.UNAUTHORIZED)
    }
}