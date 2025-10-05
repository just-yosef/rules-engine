import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './dtos/event.dto';
import { Event } from './event.model';
import { IsAdmin } from 'src/auth/interceptors';
import { RateLimiterGuard, RateLimit } from 'nestjs-rate-limiter';

@UseGuards(RateLimiterGuard)
@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @UseInterceptors(IsAdmin)
    @RateLimit({
        points: 3,
        duration: 600,
        keyPrefix: 'create-event',
        errorMessage:
            'You have reached the limit for creating events. Please wait 10 minutes.',
    })
    @Post()
    async create(@Body() body: EventDto): Promise<Event> {
        return this.eventService.create(body);
    }

    @RateLimit({
        points: 20,
        duration: 60,
        keyPrefix: 'get-events',
        errorMessage:
            'Too many requests for fetching events. Please wait a minute and try again.',
    })
    @Get()
    async findAll(): Promise<Event[]> {
        return this.eventService.findAll();
    }

    @RateLimit({
        points: 10,
        duration: 60,
        keyPrefix: 'get-event',
        errorMessage:
            'You are requesting events too frequently. Please slow down.',
    })
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Event> {
        return this.eventService.findOne(id);
    }

    @UseInterceptors(IsAdmin)
    @RateLimit({
        points: 2,
        duration: 600,
        keyPrefix: 'delete-event',
        errorMessage:
            'You can only delete 2 events every 10 minutes. Please wait before trying again.',
    })
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Event> {
        return this.eventService.delete(id);
    }
}
