import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}

  async notifyEmail({ email }: NotifyEmailDto) {
    // const transport = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: this.configService.getOrThrow<string>('EMAIL_USER'),
    //     pass: this.configService.getOrThrow<string>('EMAIL_PASSWORD'),
    //   },
    // });
    console.log(email);
  }
}
