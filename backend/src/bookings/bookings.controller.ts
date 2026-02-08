import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete,
  Res,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { BookingsService } from './bookings.service';
import { ReservationStatus } from './entities/booking.entity';
import { TicketService } from './ticket.service';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly ticketService: TicketService,
  ) {}

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

  @Get(':id/ticket')
  @UseGuards(JwtAuthGuard)
  async downloadTicket(
    @Param('id') id: string,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const booking = await this.bookingsService.findOne(id);

    // Verify the booking belongs to the user or user is admin
    const userId = req.user.userId || req.user.id;
    const isOwner = booking.participant.id === userId;
    const isAdmin = req.user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new BadRequestException('You can only download your own tickets.');
    }

    if (booking.status !== ReservationStatus.CONFIRMED) {
      throw new BadRequestException(
        'Ticket is only available for confirmed reservations.',
      );
    }

    const pdfBuffer = await this.ticketService.generateTicketPdf(booking);

    // Sanitize event title for filename
    const safeEventTitle = booking.event.title
      .replace(/[^a-z0-9]/gi, '_')
      .substring(0, 30);
    const filename = `ticket-${safeEventTitle}-${booking.id.substring(0, 8)}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }

  @Patch(':id/cancel')
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
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ReservationStatus,
  ) {
    return this.bookingsService.updateStatus(id, status);
  }
}
