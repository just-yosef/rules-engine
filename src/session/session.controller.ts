import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SessionService } from "./session.service"
import { CreateSessionDto } from './dtos';
import { Session } from './session.model';
@Controller('session')
export class SessionController {
    constructor(private readonly sessionsService: SessionService) { }
    @Get('/:sessionId')
    async getUserSessions(@Param('sessionId') sessionId: string) {
        return this.sessionsService.getUserSessions(sessionId);
    }
    @Get()
    async getAllSessions(): Promise<Session[]> {
        return this.sessionsService.getAllSessions();
    }
    @Post()
    async createSession(@Body() sessionData: CreateSessionDto) {
        return this.sessionsService.createSession(sessionData)
    }
    
    @Delete('/:sessionId')
    async deleteSessionsByUser(@Param('sessionId') sessionId: string) {
        return this.sessionsService.deleteSessionsByUserId(sessionId);
    }
}
