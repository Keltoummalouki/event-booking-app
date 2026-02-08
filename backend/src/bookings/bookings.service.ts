import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Event as EventEntity } from '../events/entities/event.entity';
import { User } from '../users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(EventEntity)
    private eventsRepository: Repository<EventEntity>,
  ) { }

  async create(eventId: string, jwtUser: any) {
    // JWT returns { userId, email, role } but TypeORM needs { id } for relations
    const participantId = jwtUser?.userId || jwtUser?.id;
    this.logger.log(`Creating booking for event ${eventId} by user ${participantId}`);

    // 1. Récupération avec relations explicites
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
      relations: ['bookings']
    });

    if (!event || event.status !== 'PUBLISHED') {
      throw new NotFoundException("Événement indisponible.");
    }

    // 2. Vérification de capacité (US-7)
    const confirmedCount = event.bookings?.filter(b => b.status === 'CONFIRMED').length || 0;
    if (confirmedCount >= event.capacity) {
      throw new BadRequestException("L'événement est complet.");
    }

    // 3. Vérification de doublon
    const existingBooking = await this.bookingsRepository.findOne({
      where: {
        event: { id: eventId },
        participant: { id: participantId }
      } as any
    });

    if (existingBooking) {
      throw new BadRequestException("Vous avez déjà réservé pour cet événement.");
    }

    // 4. Création avec référence d'ID seulement (pas l'entité complète)
    const booking = this.bookingsRepository.create({
      status: 'PENDING',
      event: { id: eventId } as EventEntity,
      participant: { id: participantId } as User,
    });

    const saved = await this.bookingsRepository.save(booking);
    this.logger.log(`Booking created successfully: ${saved.id}`);
    return saved;
  }

  async findAll() {
    return this.bookingsRepository.find({ relations: ['event', 'participant'] });
  }

  async findOne(id: string) {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['event', 'participant']
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    await this.bookingsRepository.update(id, updateBookingDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const booking = await this.findOne(id);
    await this.bookingsRepository.remove(booking);
    return booking;
  }

  async findByEvent(eventId: string) {
    return this.bookingsRepository.find({
      where: { event: { id: eventId } },
      relations: ['participant'],
      order: { createdAt: 'DESC' }
    });
  }

  async updateStatus(id: string, status: string) {
    const booking = await this.findOne(id);
    booking.status = status;
    return this.bookingsRepository.save(booking);
  }
}