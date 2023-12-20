import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '123456', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
