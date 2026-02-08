import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTICIPANT)
  async create(@Body('eventId') eventId: string, @Request() req: any) {
    return this.bookingsService.create(eventId, req.user);
  }

  @Get('my-bookings')
  @UseGuards(JwtAuthGuard)
  async findMyBookings(@Request() req: any) {
    const userId = req.user.userId || req.user.id;
    return this.bookingsService.findMyBookings(userId);
  }



  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async cancelBooking(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.userId || req.user.id;
    return this.bookingsService.cancelBooking(id, userId);
  }

  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async findByEvent(@Param('eventId') eventId: string) {
    return this.bookingsService.findByEvent(eventId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.bookingsService.updateStatus(id, status);
  }
}
