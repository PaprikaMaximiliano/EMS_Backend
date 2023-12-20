import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    return await this.userRepository.create(dto);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll({ include: { all: true } });
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      include: { all: true },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
  //
  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }
}
