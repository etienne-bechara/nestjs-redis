import { Module } from '@nestjs/common';

import { RedisModule } from '../../redis/redis.module';
import { CacheConfig } from './cache.config';

@Module({
  imports: [
    RedisModule.registerAsync({
      inject: [ CacheConfig ],
      useFactory: (cacheConfig: CacheConfig) => ({
        host: cacheConfig.REDIS_HOST,
        port: cacheConfig.REDIS_PORT,
        password: cacheConfig.REDIS_PASSWORD,
        keepAlive: 1 * 1000,
      }),
    }),
  ],
  providers: [ CacheConfig ],
  exports: [ CacheConfig ],
})
export class CacheModule { }
