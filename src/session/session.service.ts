import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Session } from './session.model';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSessionDto } from './dtos';

@Injectable()
export class SessionService {

    constructor(
        @InjectModel(Session.name)
        private readonly sessionModel: Model<Session>,
    ) { }
    async getAllSessions(): Promise<Session[]> {
        return this.sessionModel.find()
    }

    async createSession(sessionData: CreateSessionDto): Promise<Session> {
        const session = this.sessionModel.create(sessionData);
        return session
    }
    async getUserSessions(userId: string) {
        return await this.sessionModel
            .find({ userId })
    }
    async getSessionsByToken(token: string) {
        return await this.sessionModel
            .findOne({ token })
    }
    async deleteSessionsByUserId(userId: string): Promise<{ deletedCount: number }> {
        const result = await this.sessionModel.deleteMany({
            userId
        });
        return { deletedCount: result.deletedCount ?? 0 };
    }
}
