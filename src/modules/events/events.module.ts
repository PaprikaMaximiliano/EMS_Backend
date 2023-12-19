import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './events.model';
import { User } from '../users/users.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [SequelizeModule.forFeature([Event, User]), AuthModule],
})
export class EventsModule {}
