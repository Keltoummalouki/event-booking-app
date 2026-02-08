import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Event as EventEntity } from '../events/entities/event.entity';
import { User } from '../users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(EventEntity)
    private eventsRepository: Repository<EventEntity>, 
  ) {}

  async create(eventId: string, user: User) {
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

    // 3. Vérification de doublon avec syntaxe compatible TypeScript
    const existingBooking = await this.bookingsRepository.findOne({
      where: { 
        event: { id: eventId }, 
        participant: { id: user.id } 
      } as any // Le cast 'as any' ici règle le conflit de type FindOptionsWhere complexe
    });

    if (existingBooking) {
      throw new BadRequestException("Vous avez déjà réservé pour cet événement.");
    }

    // 4. Création avec typage DeepPartial strict
    const booking = this.bookingsRepository.create({
      status: 'PENDING',
    });
    booking.event = event;
    booking.participant = user;

    return await this.bookingsRepository.save(booking);
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
}