import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) { }

  async create(createEventDto: CreateEventDto, jwtUser: any): Promise<Event> {
    // JWT returns { userId, email, role } but TypeORM needs { id } for relations
    const organizerId = jwtUser?.userId || jwtUser?.id;
    this.logger.log(`Creating event: ${createEventDto.title} by user: ${organizerId}`);

    try {
      const newEvent = this.eventsRepository.create({
        title: createEventDto.title,
        description: createEventDto.description,
        date: new Date(createEventDto.date),
        location: createEventDto.location,
        capacity: createEventDto.capacity,
        status: createEventDto.status || EventStatus.DRAFT,
        organizer: { id: organizerId } as User,
      });

      const saved = await this.eventsRepository.save(newEvent);
      this.logger.log(`Event created successfully: ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Error creating event: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Erreur lors de la création de l'événement: ${error.message}`);
    }
  }

  async findAll(status?: string): Promise<Event[]> {
    const query = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer');

    if (status) {
      query.where('event.status = :status', { status });
    }

    query.orderBy('event.date', 'ASC');

    return await query.getMany();
  }

  async publish(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Événement avec l'ID ${id} introuvable`);
    }

    event.status = EventStatus.PUBLISHED;
    return await this.eventsRepository.save(event);
  }

  async findAllPublished(): Promise<Event[]> {
    return await this.eventsRepository.find({
      where: { status: EventStatus.PUBLISHED },
      relations: ['organizer'],
      order: { date: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!event) {
      throw new NotFoundException(`Événement avec l'ID ${id} introuvable`);
    }

    return event;
  }

  async update(id: string, updateEventDto: Partial<CreateEventDto>): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Événement avec l'ID ${id} introuvable`);
    }

    // Merge new values into existing event
    const updatedEvent = this.eventsRepository.merge(event, {
      ...updateEventDto,
      date: updateEventDto.date ? new Date(updateEventDto.date) : event.date,
    });

    return await this.eventsRepository.save(updatedEvent);
  }

  async remove(id: string): Promise<void> {
    const event = await this.eventsRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Événement avec l'ID ${id} introuvable`);
    }

    await this.eventsRepository.remove(event);
    this.logger.log(`Event deleted: ${id}`);
  }
}

