import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from '../../modules/events/events.model';

@Injectable()
export class UserOwnsEventGuard implements CanActivate {
  constructor(@InjectModel(Event) private eventRepository: typeof Event) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { id: eventId } = request.params;
    const { id: userId } = request.user;

    const event = await this.eventRepository.findByPk(eventId);

    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    if (+userId !== event.userId) {
      throw new HttpException(
        'You do not have access to this action.',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
