import { AppModule } from '@bechara/nestjs-core';

import { RedisConfig } from '../redis/redis.config';
import { RedisModule } from '../redis/redis.module';

/**
 * Fully boots all modules for testing purposes.
 */
void AppModule.bootServer({
  disableModuleScan: true,
  configs: [ RedisConfig ],
  imports: [
    RedisModule.registerAsync({
      inject: [ RedisConfig ],
      useFactory: (redisConfig: RedisConfig) => ({
        host: redisConfig.REDIS_HOST,
        port: redisConfig.REDIS_PORT,
        username: redisConfig.REDIS_USERNAME,
        password: redisConfig.REDIS_PASSWORD,
        keepAlive: 1 * 1000,
      }),
    }),
  ],
  exports: [ RedisModule ],
});
