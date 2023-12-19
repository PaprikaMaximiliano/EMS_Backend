import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateEventDto } from './dto/update-event.dto';
import { UserId } from '../../common/decorators/userId.decorator';
import { UserOwnsEventGuard } from '../../common/guards/user-owns-event.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  createEvent(@Body() dto: CreateEventDto, @UserId() userId: number) {
    return this.eventsService.createEvent(dto, userId);
  }

  @Get()
  getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @Get('/:id')
  getEventById(@Param('id') id: number) {
    return this.eventsService.getEventById(id);
  }

  @Delete('/:id')
  @UseGuards(UserOwnsEventGuard)
  deleteEvent(@Param('id') id: number) {
    return this.eventsService.deleteEvent(id);
  }

  @Put('/:id')
  @UseGuards(UserOwnsEventGuard)
  updateRecord(@Body() dto: UpdateEventDto, @Param('id') id: number) {
    return this.eventsService.updateRecord(dto, id);
  }
}
