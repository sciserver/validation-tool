import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { DatabaseModule } from './database/database.module';
import { ReviewModule } from './review/review.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    AdminModule,
    AuthModule,
    DatabaseModule,
    ReviewModule,
    UsersModule,
  ],
  providers: [AppService, Logger],
  controllers: [AppController],
})
export class AppModule {}
