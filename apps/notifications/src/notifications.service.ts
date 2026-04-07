import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly _configService: ConfigService) {}

  notifyEmail({ email }: NotifyEmailDto) {
    // Fake implementation
    console.log(email);
    return;
  }
}
