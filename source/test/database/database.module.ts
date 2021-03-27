import { Module } from '@nestjs/common';

import { RedisModule } from '../../redis/redis.module';
import { DatabaseConfig } from './database.config';

@Module({
  imports: [
    RedisModule.registerAsync({
      inject: [ DatabaseConfig ],
      useFactory: (databaseConfig: DatabaseConfig) => ({
        host: databaseConfig.REDIS_HOST,
        port: databaseConfig.REDIS_PORT,
        password: databaseConfig.REDIS_PASSWORD,
        keepAlive: 1 * 1000,
      }),
    }),
  ],
  providers: [ DatabaseConfig ],
  exports: [ DatabaseConfig ],
})
export class DatabaseModule { }
