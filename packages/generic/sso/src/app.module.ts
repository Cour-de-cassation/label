import { Module } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ConfigModule } from '@nestjs/config';
import { SamlModule } from './api/saml/saml.module';
import { AuthModule } from './api/auth/auth.module';
import { envValidationConfig } from './config/env.validation';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(envValidationConfig), SamlModule],
})
export class AppModule {}
