import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventModel } from './event.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventModel }]),
  forwardRef(() => UsersModule)
  ],
  providers: [EventService,],
  controllers: [EventController],
  exports: [EventService]
})
export class EventModule { }
