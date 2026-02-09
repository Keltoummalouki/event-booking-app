import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Event, EventStatus } from './entities/event.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { NotFoundException } from '@nestjs/common';

const mockEventRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  }),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('EventsService', () => {
  let service: EventsService;
  let repository: MockRepository<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useFactory: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<MockRepository<Event>>(getRepositoryToken(Event));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const createEventDto: CreateEventDto = {
        title: 'Test Event',
        description: 'Description',
        date: new Date().toISOString(),
        location: 'Paris',
        capacity: 100,
      };
      const user = { userId: '1' };
      const savedEvent = { id: '1', ...createEventDto, organizer: { id: '1' } };

      repository.create.mockReturnValue(savedEvent);
      repository.save.mockResolvedValue(savedEvent);

      const result = await service.create(createEventDto, user);

      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(savedEvent);
      expect(result).toEqual(savedEvent);
    });
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const result = await service.findAll();
      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an event', async () => {
      const event = { id: '1', title: 'Test Event' };
      repository.findOne.mockResolvedValue(event);

      const result = await service.findOne('1');
      expect(result).toEqual(event);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findOne('99')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const event = { id: '1', title: 'Old Title', date: new Date() };
      const updateDto = { title: 'New Title' };
      const updatedEvent = { ...event, ...updateDto };

      repository.findOne.mockResolvedValue(event);
      repository.merge.mockReturnValue(updatedEvent);
      repository.save.mockResolvedValue(updatedEvent);

      const result = await service.update('1', updateDto);
      expect(repository.merge).toHaveBeenCalled();
      expect(result).toEqual(updatedEvent);
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      const event = { id: '1' };
      repository.findOne.mockResolvedValue(event);
      repository.remove.mockResolvedValue(event);

      await service.remove('1');
      expect(repository.remove).toHaveBeenCalledWith(event);
    });
  });
});
