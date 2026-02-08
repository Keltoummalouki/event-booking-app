import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { Booking, ReservationStatus } from './entities/booking.entity';
import { Event as EventEntity } from '../events/entities/event.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

const mockBookingRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

const mockEventRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingsRepository: MockRepository<Booking>;
  let eventsRepository: MockRepository<EventEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useFactory: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(EventEntity),
          useFactory: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingsRepository = module.get<MockRepository<Booking>>(
      getRepositoryToken(Booking),
    );
    eventsRepository = module.get<MockRepository<EventEntity>>(
      getRepositoryToken(EventEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking', async () => {
      const eventId = '1';
      const user = { userId: '1' };
      const event = {
        id: eventId,
        status: 'PUBLISHED',
        capacity: 10,
        bookings: [],
      };
      const booking = { id: '1', status: ReservationStatus.PENDING };

      eventsRepository.findOne.mockResolvedValue(event);
      bookingsRepository.findOne.mockResolvedValue(null); // No duplicate
      bookingsRepository.create.mockReturnValue(booking);
      bookingsRepository.save.mockResolvedValue(booking);

      const result = await service.create(eventId, user);

      expect(eventsRepository.findOne).toHaveBeenCalled();
      expect(bookingsRepository.save).toHaveBeenCalled();
      expect(result).toEqual(booking);
    });

    it('should throw BadRequest if event is full', async () => {
      const event = {
        id: '1',
        status: 'PUBLISHED',
        capacity: 1,
        bookings: [{ status: ReservationStatus.CONFIRMED }],
      };
      eventsRepository.findOne.mockResolvedValue(event);

      await expect(service.create('1', { userId: '2' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a booking', async () => {
      const booking = { id: '1' };
      bookingsRepository.findOne.mockResolvedValue(booking);

      const result = await service.findOne('1');
      expect(result).toEqual(booking);
    });
  });

  describe('updateStatus', () => {
    it('should update status and decrement capacity if confirmed', async () => {
      const booking = {
        id: '1',
        status: ReservationStatus.PENDING,
        event: { id: '1' },
      };
      const event = { id: '1', capacity: 10 };

      bookingsRepository.findOne.mockResolvedValue(booking);
      eventsRepository.findOne.mockResolvedValue(event);
      bookingsRepository.save.mockImplementation((b) => Promise.resolve(b));

      await service.updateStatus('1', ReservationStatus.CONFIRMED);

      expect(event.capacity).toBe(9);
      expect(eventsRepository.save).toHaveBeenCalledWith(event);
      expect(booking.status).toBe(ReservationStatus.CONFIRMED);
    });
  });

  describe('cancelBooking', () => {
    it('should cancel booking if user is owner', async () => {
      const booking = {
        id: '1',
        participant: { id: '1' },
        status: ReservationStatus.CONFIRMED,
      };
      bookingsRepository.findOne.mockResolvedValue(booking);
      bookingsRepository.save.mockResolvedValue({
        ...booking,
        status: ReservationStatus.CANCELED,
      });

      const result = await service.cancelBooking('1', '1');
      expect(result.status).toBe(ReservationStatus.CANCELED);
    });

    it('should throw BadRequest if user is not owner', async () => {
      const booking = {
        id: '1',
        participant: { id: '1' },
      };
      bookingsRepository.findOne.mockResolvedValue(booking);

      await expect(service.cancelBooking('1', '2')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
