import { DynamicModule, LoggerModule, Module } from '@bechara/nestjs-core';

import { RedisConfig } from './redis.config';
import { RedisInjectionToken } from './redis.enum';
import { RedisAsyncModuleOptions, RedisModuleOptions } from './redis.interface';
import { RedisService } from './redis.service';

@Module({
  imports: [
    LoggerModule,
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
export class RedisModule {

  /**
   * Configures the underlying client and provide a it as
   * an injectable for the service.
   * @param options
   */
  public static register(options: RedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: RedisInjectionToken.REDIS_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  /**
   * Configures the underlying client and provide a it as
   * an injectable for the service asynchronously.
   * @param options
   */
  public static registerAsync(options: RedisAsyncModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: RedisInjectionToken.REDIS_MODULE_OPTIONS,
          inject: options.inject || [ ],
          useFactory: options.useFactory,
        },
      ],
    };
  }

}
