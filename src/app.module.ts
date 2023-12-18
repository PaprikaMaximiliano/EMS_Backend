import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { User } from './modules/users/users.model';
import { AuthModule } from './modules/auth/auth.module';
import { Event } from './modules/events/events.model';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Event],
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    EventsModule,
  ],
})
export class AppModule {}
