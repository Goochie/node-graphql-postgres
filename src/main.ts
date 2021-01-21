import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as rateLimit from 'express-rate-limit';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);

  Logger.log(`🚀 Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
