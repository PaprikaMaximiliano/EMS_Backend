import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User) {
    }
    async createUser(dto: CreateUserDto): Promise<User>{
        const user = await this.userRepository.create(dto);
        return user;
    }

    async getAllUsers(): Promise<User[]>{
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    async getUserById(id: number): Promise<User>{
        const user = await this.userRepository.findOne({where: {id: id}, include: {all: true}})
        return user;
    }

    async getUserByEmail(email: string): Promise<User>{
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        return user;
    }
}
