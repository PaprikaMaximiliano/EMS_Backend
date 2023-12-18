import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateEventDto } from './dto/update-event.dto';

interface IRequest {
  user: any;
}
@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  createEvent(@Body() dto: CreateEventDto, @Req() req: IRequest) {
    return this.eventsService.createEvent(dto, req.user.id);
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
  deleteEvent(@Param('id') id: number, @Req() req: IRequest) {
    return this.eventsService.deleteEvent(id, req.user.id);
  }

  @Put('/:id')
  updateRecord(
    @Body() dto: UpdateEventDto,
    @Param('id') id: number,
    @Req() req: IRequest,
  ) {
    return this.eventsService.updateRecord(dto, id, req.user.id);
  }
}
