import { LoggerModule, UtilModule } from '@bechara/nestjs-core';
import { Module } from '@nestjs/common';

import { RedisConfig } from './redis.config';
import { RedisService } from './redis.service';

@Module({
  imports: [
    LoggerModule,
    UtilModule,
  ],
  providers: [
    RedisConfig,
    RedisService,
  ],
  exports: [
    RedisConfig,
    RedisService,
  ],
})
export class RedisModule { }
