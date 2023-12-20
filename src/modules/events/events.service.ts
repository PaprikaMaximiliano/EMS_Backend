import { Injectable, NotFoundException } from '@nestjs/common';
import { Event } from './events.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Op } from 'sequelize';
import { OrderItem } from 'sequelize/types';

type Order = 'ASC' | 'DESC';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event) private eventRepository: typeof Event) {}

  async createEvent(dto: CreateEventDto, userId: number): Promise<Event> {
    return await this.eventRepository.create({ ...dto, userId });
  }

  async getEventById(id: number) {
    return await this.eventRepository.findByPk(id);
  }

  async getAllEvents(
    field: keyof Event | null = null,
    query: string | Date,
    order: Order = 'ASC',
    userId: number,
    ownEvents: boolean = false,
  ): Promise<Event[]> {
    if (field && query) {
      return this.filterEvents(field, query, ownEvents, userId);
    }
    if (field && order) {
      return this.sortEvents(field, order, ownEvents, userId);
    }

    if (ownEvents) {
      return await this.eventRepository.findAll({ where: { userId } });
    }
    return await this.eventRepository.findAll();
  }

  private async filterEvents(
    field: keyof Event,
    query: string | Date,
    ownEvents: boolean,
    userId: number,
  ) {
    let whereCondition = {};
    whereCondition[field] = {
      [Op.iRegexp]: `.*${query}.*`,
    };

    if (ownEvents && userId !== -1) {
      // Include both conditions in an array
      whereCondition = {
        [Op.and]: [
          whereCondition,
          { userId: userId }, // Adjust this based on your actual Event model structure
        ],
      };
    }

    return await this.eventRepository.findAll({
      where: whereCondition,
    });
  }

  private async sortEvents(
    field: keyof Event,
    order: Order,
    ownEvents: boolean,
    userId: number,
  ): Promise<Event[]> {
    const orderCriteria: OrderItem[] = [[field, order]];

    let whereCondition: any = {};

    if (ownEvents && userId !== -1) {
      whereCondition = { userId: userId }; // Adjust this based on your Event model structure
    }

    return await this.eventRepository.findAll({
      order: orderCriteria,
      where: whereCondition,
    });
  }

  async deleteEvent(id: number) {
    const eventToDelete = await this.eventRepository.findByPk(id);
    await this.eventRepository.destroy({ where: { id: id } });
    return eventToDelete;
  }

  async updateRecord(dto: UpdateEventDto, id: number): Promise<Event> {
    try {
      const eventToUpdate = await this.eventRepository.findByPk(id);
      if (!eventToUpdate) {
        console.log('Error');
      }
      const response = await this.eventRepository.update(dto, {
        where: {
          id: id,
        },
        returning: true,
      });
      return response[1][0];
    } catch (error) {
      throw new NotFoundException(`Error updating record: ${error.message}`);
    }
  }

  async getRecommendedEvents(id: number) {
    const event = await this.getEventById(id);

    const currentDate = new Date();

    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(currentDate.getDate() + 5);

    return await this.eventRepository.findAll({
      where: {
        [Op.and]: {
          [Op.or]: [{ category: event.category }, { location: event.location }],
          id: {
            [Op.not]: event.id,
          },
        },
      },
    });
  }
}
