import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '@app/common';
import { UsersRepository } from './users.repository';
import { compare, hash } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUser: CreateUserDto) {
    await this.validateCreateUser(createUser);
    const password = await hash(createUser.password, 10);
    return this.usersRepository.create(
      new User({
        email: createUser.email,
        password,
      }),
    );
  }

  private async validateCreateUser(createUser: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUser.email });
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
      const passwordMatches = await compare(password, user.password);

      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async getUser(getUser: GetUserDto) {
    return this.usersRepository.findOne({ id: getUser.id });
  }
}
