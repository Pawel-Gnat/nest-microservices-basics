import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma.service';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto);
    return this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        password: await hash(createUserDto.password, 10),
      },
    });
  }

  private async validateCreateUser(createUser: CreateUserDto) {
    try {
      await this.prismaService.user.findFirstOrThrow({
        where: { email: createUser.email },
      });
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
      const user = await this.prismaService.user.findFirstOrThrow({
        where: { email },
      });
      const passwordMatches = await compare(password, user.password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (_error: unknown) {
      if (_error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw _error;
    }
  }

  async getUser(getUser: GetUserDto) {
    return this.prismaService.user.findUniqueOrThrow({
      where: {
        id: +getUser.id,
      },
    });
  }
}
