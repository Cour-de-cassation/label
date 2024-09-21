import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'myPrivateKey',
      signOptions: { expiresIn: '60s' },
    }),
    /*JwtModule.registerAsync({
      imports: [ConfigModule], // Missing this
      useFactory: async () => ({
        signOptions: {
          expiresIn: '3600s',
        },
        secretOrPrivateKey: 'myPrivateKey',
      }),
      inject: [ConfigService],
    }),*/
  ],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, PassportModule, AuthService],
})
export class AuthModule {}
