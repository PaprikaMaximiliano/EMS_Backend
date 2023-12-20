import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'React bootcamp', description: 'Title' })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'Lviv', description: 'Location' })
  @IsNotEmpty()
  @IsString()
  readonly location: string;

  @ApiProperty({ example: 'IT', description: 'Category' })
  @IsNotEmpty()
  @IsString()
  readonly category: string;

  @ApiProperty({
    example: 'Learn about react on free bootcamp',
    description: 'Description',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({ example: '2023-12-14T22:00:00.000Z', description: 'Date' })
  @IsNotEmpty()
  @IsString()
  readonly date: string;
}
