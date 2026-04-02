import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (_error: unknown) {
      if (_error instanceof NotFoundException) {
        return;
      }
      return;
    }
    throw new UnprocessableEntityException('User already exists');
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersRepository.findOne({ email });
      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }
}
