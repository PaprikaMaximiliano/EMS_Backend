import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType } from 'sequelize-typescript';

import { IsString, isString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  readonly title: string;

  // location: string;
  @IsString()
  readonly category: string;

  @IsString()
  readonly description: string;
}
