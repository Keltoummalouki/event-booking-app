import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { User } from './users/entities/user.entity';
import { Event } from './events/entities/event.entity';
import { Booking } from './bookings/entities/booking.entity';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'event_booking_db',
      entities: [User, Event, Booking],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    EventsModule,
    BookingsModule,
  ],
})
export class AppModule {}
