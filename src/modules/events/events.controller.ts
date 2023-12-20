import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateEventDto } from './dto/update-event.dto';
import { UserId } from '../../common/decorators/userId.decorator';
import { UserOwnsEventGuard } from '../../common/guards/user-owns-event.guard';
import { Event } from './events.model';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../users/users.model';

type Order = 'ASC' | 'DESC';

@ApiTags('Events')
@ApiHeader({
  name: 'Authorization',
  required: true,
  description:
    'Before running endpoint insert your token. Example: Bearer &lt;token&gt;',
})
@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Create event' })
  @ApiResponse({ status: 200, type: Event })
  @Post()
  createEvent(@Body() dto: CreateEventDto, @UserId() userId: number) {
    return this.eventsService.createEvent(dto, userId);
  }

  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, type: [Event] })
  @ApiQuery({
    name: 'field',
    required: false,
    description:
      "Field of Event which will be used in sorting/filtering. Date can't be filtered.",
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Query for filtering',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: 'Order of sorting',
  })
  @Get()
  getAllEvents(
    @Query('field') field: keyof Event,
    @Query('query') query: string | null,
    @Query('order') order: Order | null,
    @UserId() userId: number,
  ) {
    return this.eventsService.getAllEvents(field, query, order, userId);
  }

  @ApiOperation({ summary: 'Get users own events' })
  @ApiResponse({ status: 200, type: User })
  @ApiQuery({
    name: 'field',
    required: false,
    description:
      "Field of Event which will be used in sorting/filtering. Date can't be filtered.",
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Query for filtering',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: 'Order of sorting',
  })
  @Get('/my')
  getMyEvents(
    @Query('field') field: keyof Event,
    @Query('query') query: string | Date | null,
    @Query('order') order: Order | null,
    @UserId() userId: number,
  ) {
    return this.eventsService.getAllEvents(field, query, order, userId, true);
  }

  @ApiOperation({ summary: 'Get recommended events' })
  @ApiResponse({ status: 200, type: [Event] })
  @ApiQuery({
    name: 'id',
    required: true,
    description: 'Used for getting recommended.',
  })
  @Get('/recommended')
  getRecommendedEvents(@Query('id') id: number) {
    return this.eventsService.getRecommendedEvents(id);
  }

  @ApiOperation({ summary: 'Get event by id' })
  @ApiResponse({ status: 200, type: Event })
  @Get('/:id')
  getEventById(@Param('id') id: number) {
    return this.eventsService.getEventById(id);
  }

  @ApiOperation({ summary: 'Delete event by id' })
  @ApiResponse({ status: 200, type: Event })
  @Delete('/:id')
  @UseGuards(UserOwnsEventGuard)
  deleteEvent(@Param('id') id: number) {
    return this.eventsService.deleteEvent(id);
  }

  @ApiOperation({ summary: 'Update event by id' })
  @ApiResponse({ status: 200, type: Event })
  @Put('/:id')
  @UseGuards(UserOwnsEventGuard)
  updateRecord(@Body() dto: UpdateEventDto, @Param('id') id: number) {
    return this.eventsService.updateRecord(dto, id);
  }
}
