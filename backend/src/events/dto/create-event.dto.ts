import { IsString, IsNotEmpty, IsDateString, IsInt, Min, IsEnum, IsOptional } from 'class-validator';
import { EventStatus } from '../entities/event.entity';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;
}