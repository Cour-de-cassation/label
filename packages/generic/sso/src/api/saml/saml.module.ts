import { Module } from '@nestjs/common';
import { SamlService } from './saml.service';
import { SamlController } from './saml.controller';
import { AuthService } from '../auth/auth.service';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    JwtModule.registerAsync({
      imports: [ConfigModule], // Missing this
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: '3600s',
        },
        secretOrPrivateKey: configService.get<string>('JWT_SECRET') || 'myPrivateKey',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SamlController],
  providers: [SamlService, AuthService],
})
export class SamlModule {}
