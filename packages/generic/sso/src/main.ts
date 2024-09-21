import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: '*', // ou '*' pour autoriser toutes les origines
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  };
  app.enableCors(corsOptions);
  // Add API Documentation with Swagger
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
  /*const config = new DocumentBuilder()
    .setTitle('API SSO NESTJS')
    .setDescription('SWAGGER SSO.')
    .setVersion('1.0')
    .addTag('SSO NestJS')
    .build();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
  const document = SwaggerModule.createDocument(app, config);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  SwaggerModule.setup('doc', app, document);*/

  await app.listen(process.env.SSO_API_PORT || 3005);
}
bootstrap();
