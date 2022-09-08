import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectionPool, connect } from 'mssql';

@Injectable()
export class DatabaseService {
  private pool: ConnectionPool = undefined;
  constructor(private configService: ConfigService) {}

  async getConnection() {
    if (!this.pool) {
      this.pool = await connect({
        user: this.configService.get('DB_USER'),
        password: this.configService.get('DB_PASSWORD'),
        server: this.configService.get('DB_SERVER'),
        port: parseInt(this.configService.get('DB_PORT')),
        database: this.configService.get('DB_DATABASE'),
        options: {
          encrypt: false,
        },
      });
    }

    return this.pool;
  }
}
