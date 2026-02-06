import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
    try {
      const newEvent = this.eventsRepository.create({
        title: createEventDto.title,
        description: createEventDto.description,
        date: new Date(createEventDto.date),
        location: createEventDto.location,
        capacity: createEventDto.capacity,
        status: createEventDto.status || EventStatus.DRAFT,
        organizer: user,
      });

      return await this.eventsRepository.save(newEvent);
    } catch (error) {
      throw new InternalServerErrorException("Erreur lors de la création de l'événement");
    }
  }

  async findAll(status?: string): Promise<Event[]> {
    const query = this.eventsRepository.createQueryBuilder('event');
    if (status) {
      query.where('event.status = :status', { status });
    }
    return await query.getMany();
  }
}