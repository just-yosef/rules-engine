import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './session.model';
import { SessionController } from './session.controller';

@Module({
  imports: [MongooseModule.forFeature([{ schema: SessionSchema, name: Session.name }])],
  providers: [SessionService],
  exports: [SessionService],
  controllers: [SessionController]
})
export class SessionModule { }
