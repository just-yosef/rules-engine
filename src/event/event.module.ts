import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventModel } from './event.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventModel }])],
  providers: [EventService],
  controllers: [EventController]
})
export class EventModule { }
