import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Event } from './events.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../users/users.model';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event) private eventRepository: typeof Event) {}

  async createEvent(dto: CreateEventDto, userId: number): Promise<Event> {
    return await this.eventRepository.create({ ...dto, userId });
  }

  async getEventById(id: number) {
    return await this.eventRepository.findOne({ where: { id } });
  }

  async getAllEvents(): Promise<Event[]> {
    return await this.eventRepository.findAll();
  }

  async deleteEvent(id: number, userId: number) {
    const eventToDelete = await this.eventRepository.findOne({
      where: { id: id },
    });
    if (userId !== eventToDelete.userId) {
      throw new HttpException(
        "You can not delete others' events",
        HttpStatus.FORBIDDEN,
      );
    }
    await this.eventRepository.destroy({ where: { id: id } });
    return {
      message: `Event ${eventToDelete.title} was deleted.`,
      deletedEvent: eventToDelete,
    };
    // const eventToDelete = await this.eventRepository.findOne({where: {id: id, userId}});
  }

  async updateRecord(
    dto: UpdateEventDto,
    id: number,
    userId: number,
  ): Promise<Event> {
    try {
      const eventToUpdate = await this.eventRepository.findOne({
        where: { id: id },
      });
      if (userId !== eventToUpdate.userId) {
        throw new HttpException(
          "You can not delete others' events",
          HttpStatus.FORBIDDEN,
        );
      }
      const response = await this.eventRepository.update(dto, {
        where: {
          id: id,
        },
        returning: true, // Get the updated record back
      });
      return response[1][0];
    } catch (error) {
      throw new Error(`Error updating record: ${error.message}`);
    }
  }
}
