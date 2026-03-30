import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isDev = configService.get('NODE_ENV') === 'development';

        return {
          pinoHttp: isDev
            ? {
                transport: {
                  target: 'pino-pretty',
                  options: { singleLine: true },
                },
              }
            : {},
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class LoggerModule {}
