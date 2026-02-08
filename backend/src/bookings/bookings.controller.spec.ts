import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TicketService } from './ticket.service';
import { ReservationStatus } from './entities/booking.entity';
import { UserRole } from '../users/entities/user.entity';
import { Response } from 'express';
import { BadRequestException } from '@nestjs/common';

describe('BookingsController', () => {
  let controller: BookingsController;
  let bookingsService: Partial<Record<keyof BookingsService, jest.Mock>>;
  let ticketService: Partial<Record<keyof TicketService, jest.Mock>>;

  beforeEach(async () => {
    bookingsService = {
      create: jest.fn(),
      findMyBookings: jest.fn(),
      findOne: jest.fn(),
      cancelBooking: jest.fn(),
      findByEvent: jest.fn(),
      updateStatus: jest.fn(),
    };
    ticketService = {
      generateTicketPdf: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: bookingsService,
        },
        {
          provide: TicketService,
          useValue: ticketService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking', async () => {
      const eventId = '1';
      const req = { user: { userId: '1' } };
      const expectedResult = { id: '1', event: { id: eventId } };
      bookingsService.create.mockResolvedValue(expectedResult);

      expect(await controller.create(eventId, req)).toBe(expectedResult);
      expect(bookingsService.create).toHaveBeenCalledWith(eventId, req.user);
    });
  });

  describe('findMyBookings', () => {
    it('should return bookings for user', async () => {
      const req = { user: { userId: '1' } };
      const bookings = [];
      bookingsService.findMyBookings.mockResolvedValue(bookings);

      expect(await controller.findMyBookings(req)).toBe(bookings);
      expect(bookingsService.findMyBookings).toHaveBeenCalledWith('1');
    });
  });

  describe('downloadTicket', () => {
    it('should generate and send PDF ticket', async () => {
      const id = '1';
      const req = { user: { userId: '1', role: UserRole.PARTICIPANT } };
      const res = {
        set: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;
      const booking = {
        id: '1',
        participant: { id: '1' },
        status: ReservationStatus.CONFIRMED,
        event: { title: 'Test Event' },
      };
      const pdfBuffer = Buffer.from('PDF');

      bookingsService.findOne.mockResolvedValue(booking);
      ticketService.generateTicketPdf.mockResolvedValue(pdfBuffer);

      await controller.downloadTicket(id, req, res);

      expect(ticketService.generateTicketPdf).toHaveBeenCalledWith(booking);
      expect(res.set).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(pdfBuffer);
    });

    it('should throw BadRequest if user is not owner', async () => {
      const id = '1';
      const req = { user: { userId: '2', role: UserRole.PARTICIPANT } };
      const res = {} as Response;
      const booking = {
        id: '1',
        participant: { id: '1' },
        status: ReservationStatus.CONFIRMED,
      };

      bookingsService.findOne.mockResolvedValue(booking);

      await expect(controller.downloadTicket(id, req, res)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking', async () => {
      const id = '1';
      const req = { user: { userId: '1' } };
      const result = { id, status: ReservationStatus.CANCELED };
      bookingsService.cancelBooking.mockResolvedValue(result);

      expect(await controller.cancelBooking(id, req)).toBe(result);
      expect(bookingsService.cancelBooking).toHaveBeenCalledWith(id, '1');
    });
  });

  describe('findByEvent', () => {
    it('should return bookings for event', async () => {
      const eventId = '1';
      const bookings = [];
      bookingsService.findByEvent.mockResolvedValue(bookings);

      expect(await controller.findByEvent(eventId)).toBe(bookings);
      expect(bookingsService.findByEvent).toHaveBeenCalledWith(eventId);
    });
  });

  describe('updateStatus', () => {
    it('should update booking status', async () => {
      const id = '1';
      const status = ReservationStatus.CONFIRMED;
      const result = { id, status };
      bookingsService.updateStatus.mockResolvedValue(result);

      expect(await controller.updateStatus(id, status)).toBe(result);
      expect(bookingsService.updateStatus).toHaveBeenCalledWith(id, status);
    });
  });
});
