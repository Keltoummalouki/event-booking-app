import { Controller, Post, Body, UseGuards, Request, Get, Query, Param, Patch } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Seul l'Admin peut créer
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user);
  }

  @Get() // Catalogue public
  findAll(@Query('status') status: string) {
    // Par défaut, on ne montre que les PUBLISHED aux non-admins
    return this.eventsService.findAll(status);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  publish(@Param('id') id: string) {
    return this.eventsService.publish(id);
  }
}