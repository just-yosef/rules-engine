import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './event.model';
import { Model } from 'mongoose';
import { EventDto } from './dtos/event.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CacheKeys } from 'src/auth/constants';

@Injectable()
export class EventService {
    constructor(
        @InjectModel(Event.name) private readonly Event: Model<Event>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) { }

    async create(eventData: EventDto): Promise<Event> {
        const createdEvent = await this.Event.create(eventData);
        await this.cacheManager.del(CacheKeys.allEvents);
        return createdEvent;
    }

    async findAll(): Promise<Event[]> {
        const cacheKey = CacheKeys.allEvents;
        const cached = await this.cacheManager.get<Event[]>(cacheKey);
        if (cached) return cached;
        const events = await this.Event.find().exec();
        await this.cacheManager.set(cacheKey, events, 300);
        return events;
    }

    async findOne(id: string): Promise<Event> {
        const cacheKey = `${CacheKeys.eventById}${id}`;
        const cached = await this.cacheManager.get<Event>(cacheKey);
        if (cached) return cached;
        const event = await this.Event.findById(id).exec();
        if (!event) throw new NotFoundException(`Event with ID ${id} not found`);
        await this.cacheManager.set(cacheKey, event, 300);
        return event;
    }

    async update(id: string, updateData: Partial<Event>): Promise<Event> {
        const updated = await this.Event.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!updated) throw new NotFoundException(`Event with ID ${id} not found`);
        await this.cacheManager.del('events_all');
        await this.cacheManager.del(`event_${id}`);
        return updated;
    }

    async delete(id: string): Promise<Event> {
        const deleted = await this.Event.findByIdAndDelete(id).exec();
        if (!deleted) throw new NotFoundException(`Event with ID ${id} not found`);
        await this.cacheManager.del('events_all');
        await this.cacheManager.del(`event_${id}`);
        return deleted;
    }
}
