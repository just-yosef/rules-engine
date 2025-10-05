import { Body, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './dtos/event.dto';
import { Event } from './event.model';
import { IsLoggedIn } from 'src/auth/guards';
import { IsAdmin } from 'src/auth/interceptors';
@UseGuards(IsLoggedIn)
@UseInterceptors(IsAdmin)
@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Post()
    async create(@Body() body: EventDto): Promise<Event> {
        return this.eventService.create(body);
    }

    @Get()
    async findAll(): Promise<Event[]> {
        return this.eventService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<Event> {
        return this.eventService.findOne(id);
    }

    // @Patch(":id")
    // async update(
    //     @Param("id") id: string,
    //     @Body() body: UpdateEventDto,
    // ): Promise<Event> {
    //     return this.eventService.update(id, body);
    // }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<Event> {
        return this.eventService.delete(id);
    }
}
