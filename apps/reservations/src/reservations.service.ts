import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PAYMENTS_SERVICE, User } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { PrismaService } from './prisma.service';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(PAYMENTS_SERVICE)
    private readonly paymentsService: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, user: User) {
    return this.paymentsService
      .send('create_charge', {
        ...createReservationDto.charge,
        email: user.email,
      })
      .pipe(
        map((res) => {
          return this.prismaService.reservation.create({
            data: {
              startDate: createReservationDto.startDate,
              endDate: createReservationDto.endDate,
              invoiceId: res.id,
              timestamp: new Date(),
              userId: user.id,
            },
          });
        }),
      );
  }

  async findAll() {
    return this.prismaService.reservation.findMany({});
  }

  async findOne(id: number) {
    return this.prismaService.reservation.findUniqueOrThrow({ where: { id } });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.prismaService.reservation.update({
      where: { id },
      data: updateReservationDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.reservation.delete({ where: { id } });
  }
}
