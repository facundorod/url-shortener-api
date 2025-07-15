import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonLogger } from './infrastructure/adapters/winston/winston.adapter';
import { AllExceptionFilter } from './infrastructure/filters/all-exception/all-exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
    logger: new WinstonLogger(),
  });
  app.useGlobalFilters(new AllExceptionFilter(new WinstonLogger()));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
