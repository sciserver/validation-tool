import { NestFactory } from '@nestjs/core';
import { ReviewService } from '../review/review.service';
import { AppModule } from '../app.module';

/**
 * Description
 * @return {any}
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(ReviewService);
  await service.checkAndAssignNewItems();
  await app.close();
}

bootstrap();
