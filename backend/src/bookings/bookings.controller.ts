import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common'; // Assure-toi que c'est bien @nestjs/common
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  // Assure-ce que @Request() vient de NestJS et non d'un type global
  async create(@Body('eventId') eventId: string, @Request() req: any) {
    return this.bookingsService.create(eventId, req.user);
  }
}