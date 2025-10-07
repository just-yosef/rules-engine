import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, } from './event.model';
import { Model } from 'mongoose';
import { EventDto } from './dtos/event.dto';

@Injectable()
export class EventService {
    constructor(@InjectModel(Event.name) private readonly Event: Model<Event>) { }
    async create(eventData: EventDto): Promise<Event> {
        const createdEvent = this.Event.create(eventData);
        return createdEvent
    }

    async findAll(): Promise<Event[]> {
        return this.Event.find().exec();
    }

    async findOne(id: string): Promise<Event> {
        const event = await this.Event.findById(id).exec();
        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
    }

    async update(id: string, updateData: Partial<Event>): Promise<Event> {
        const updated = await this.Event
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        if (!updated) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return updated;
    }

    // Delete
    async delete(id: string): Promise<Event> {
        const deleted = await this.Event.findByIdAndDelete(id).exec();
        if (!deleted) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return deleted;
    }
}
