import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';

interface EventCreationAttrs {
  title: string;
  category: string;
  description: string;
  userId: number;
}

@Table({ tableName: 'events' })
export class Event extends Model<Event, EventCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'React.js Bootcamp', description: 'Title of event' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: 'Lviv', description: 'Location of event' })
  @Column({ type: DataType.STRING, allowNull: false })
  location: string;

  @ApiProperty({ example: 'IT', description: 'Category of event' })
  @Column({ type: DataType.STRING, allowNull: false })
  category: string;

  @ApiProperty({ example: '2022-12-01', description: 'Date of event' })
  @Column({ type: DataType.DATE, allowNull: false })
  date: string;

  @ApiProperty({
    example: 'This event is about IT.',
    description: 'Description of event',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.INTEGER })
  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  author: User;
}
