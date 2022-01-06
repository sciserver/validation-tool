import { Logger, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';

@Module({
  imports: [AuthModule],
  providers: [AppService, Logger],
  controllers: [AppController],
})
export class AppModule {}
