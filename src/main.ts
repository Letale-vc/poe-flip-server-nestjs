import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: true }));
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.listen(3000);
}

void bootstrap();
