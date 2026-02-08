import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';

describe('EventsController', () => {
  let controller: EventsController;
  let service: Partial<Record<keyof EventsService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllPublished: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      publish: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const createEventDto: CreateEventDto = {
        title: 'Test Event',
        description: 'Desc',
        date: new Date().toISOString(),
        location: 'Paris',
        capacity: 100,
      };
      const req = { user: { userId: '1' } };
      const expectedResult = { id: '1', ...createEventDto };

      service.create.mockResolvedValue(expectedResult);

      expect(await controller.create(createEventDto, req)).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createEventDto, req.user);
    });
  });

  describe('findAll', () => {
    it('should return all events', async () => {
      const result = [];
      service.findAll.mockResolvedValue(result);

      expect(await controller.findAll('status')).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith('status');
    });
  });

  describe('findAllPublic', () => {
    it('should return published events', async () => {
      const result = [];
      const req = { user: { userId: '1' } };
      service.findAllPublished.mockResolvedValue(result);

      expect(await controller.findAllPublic(req)).toBe(result);
      expect(service.findAllPublished).toHaveBeenCalledWith('1');
    });
  });

  describe('findOne', () => {
    it('should return an event', async () => {
      const result = { id: '1', title: 'Test' };
      service.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const updateDto = { title: 'New Title' };
      const result = { id: '1', ...updateDto };
      service.update.mockResolvedValue(result);

      expect(await controller.update('1', updateDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('publish', () => {
    it('should publish an event', async () => {
      const result = { id: '1', status: 'PUBLISHED' };
      service.publish.mockResolvedValue(result);

      expect(await controller.publish('1')).toBe(result);
      expect(service.publish).toHaveBeenCalledWith('1');
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
