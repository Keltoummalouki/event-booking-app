import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { Booking, ReservationStatus } from './entities/booking.entity';
import { EventStatus } from '../events/entities/event.entity';
import { UserRole, User } from '../users/entities/user.entity';
import * as QRCode from 'qrcode';

// Mock pdfkit
const mockPDFDocument = {
  on: jest.fn(),
  end: jest.fn(),
  rect: jest.fn().mockReturnThis(),
  strokeColor: jest.fn().mockReturnThis(),
  lineWidth: jest.fn().mockReturnThis(),
  stroke: jest.fn().mockReturnThis(),
  moveDown: jest.fn().mockReturnThis(),
  font: jest.fn().mockReturnThis(),
  fontSize: jest.fn().mockReturnThis(),
  fillColor: jest.fn().mockReturnThis(),
  text: jest.fn().mockReturnThis(),
  moveTo: jest.fn().mockReturnThis(),
  lineTo: jest.fn().mockReturnThis(),
  roundedRect: jest.fn().mockReturnThis(),
  fillOpacity: jest.fn().mockReturnThis(),
  fill: jest.fn().mockReturnThis(),
  image: jest.fn().mockReturnThis(),
  page: { width: 500, height: 700 }, // Mock page dimensions
  y: 100, // Mock y position
};

// Mock constructor
jest.mock('pdfkit', () => {
  return jest.fn().mockImplementation(() => mockPDFDocument);
});

// Mock qrcode
jest.mock('qrcode');

describe('TicketService', () => {
  let service: TicketService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketService],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTicketPdf', () => {
    it('should generate a PDF buffer', async () => {
      const booking: Booking = {
        id: 'booking-123',
        status: ReservationStatus.CONFIRMED,
        event: {
          id: 'event-123',
          title: 'Concert',
          date: new Date(),
          location: 'Paris',
          description: 'A great concert',
          capacity: 100,
          organizer: { id: 'org-1' } as User,
          bookings: [],
          status: EventStatus.PUBLISHED,
          createdAt: new Date(),
        },
        participant: {
          id: 'user-123',
          email: 'test@example.com',
          password: 'hash',
          role: UserRole.PARTICIPANT,
          createdAt: new Date(),
          bookings: [],
        },
        createdAt: new Date(),
      };

      (QRCode.toDataURL as jest.Mock).mockResolvedValue(
        'data:image/png;base64,mockedqrcode',
      );

      // Simulate stream events
      mockPDFDocument.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          callback(Buffer.from('PDF_CHUNK'));
        }
        if (event === 'end') {
          callback();
        }
        return mockPDFDocument;
      });

      const buffer = await service.generateTicketPdf(booking);

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.toString()).toContain('PDF_CHUNK');
      expect(mockPDFDocument.text).toHaveBeenCalledWith(
        expect.stringContaining('Concert'),
        expect.any(Number),
        expect.any(Number),
        expect.any(Object),
      );
      expect(QRCode.toDataURL).toHaveBeenCalled();
    });

    it('should reject if PDF generation fails', async () => {
      const booking: Booking = {
        id: 'booking-123',
        status: ReservationStatus.CONFIRMED,
        event: {
          id: 'event-123',
          title: 'Concert',
          date: new Date(),
          location: 'Paris',
          description: 'A great concert',
          capacity: 100,
          organizer: { id: 'org-1' } as User,
          bookings: [],
          status: EventStatus.PUBLISHED,
          createdAt: new Date(),
        },
        participant: {
          id: 'user-123',
          email: 'test@example.com',
          password: 'hash',
          role: UserRole.PARTICIPANT,
          createdAt: new Date(),
          bookings: [],
        },
        createdAt: new Date(),
      };

      (QRCode.toDataURL as jest.Mock).mockRejectedValue(
        new Error('QR Code Error'),
      );

      // Override on to not trigger end immediately
      mockPDFDocument.on.mockReturnThis();

      await expect(service.generateTicketPdf(booking)).rejects.toThrow(
        'QR Code Error',
      );
    });
  });
});
