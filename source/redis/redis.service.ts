import { LoggerService } from '@bechara/nestjs-core';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { v4 } from 'uuid';

import { RedisInjectionToken } from './redis.enum';
import { RedisModuleOptions, RedisSetParams } from './redis.interface';

@Injectable()
export class RedisService {

  private redisClient: Redis.Redis;

  public constructor(
    @Inject(RedisInjectionToken.REDIS_MODULE_OPTIONS)
    private readonly redisModuleOptions: RedisModuleOptions,
    private readonly loggerService: LoggerService,
  ) {
    if (!this.redisModuleOptions) this.redisModuleOptions = { };
    this.setupRedis();
  }

  /**
   * Sets up the redis cloud client, if reconnect procedure
   * is not provided use the default below.
   */
  private setupRedis(): void {
    if (!this.redisModuleOptions.reconnectOnError) {
      this.redisModuleOptions.reconnectOnError = (err: Error): boolean | 1 | 2 => {
        this.loggerService.error(`[RedisService] ${err.message}`, err);
        return 2;
      };
    }

    const redisHost = this.redisModuleOptions.host;
    this.redisClient = new Redis(this.redisModuleOptions);
    this.loggerService.notice(`[RedisService] Client connected at ${redisHost}`);
  }

  /**
   * Returns the underlying client.
   */
  public getClient(): Redis.Redis {
    return this.redisClient;
  }

  /**
   * Reads given key and parse its value.
   * @param key
   */
  public async getKey<T>(key: string): Promise<T> {
    this.loggerService.debug(`[RedisService] Reading key ${key}...`);

    const stringValue = await this.redisClient.get(key);
    return JSON.parse(stringValue);
  }

  /**
   * When setting a key always stringify it to preserve
   * type information.
   * @param params
   */
  public async setKey(params: RedisSetParams): Promise<void> {
    const extraParams = [ ];

    if (params.skip === 'IF_EXIST') extraParams.push('NX');
    if (params.skip === 'IF_NOT_EXIST') extraParams.push('XX');

    if (params.keepTtl) {
      extraParams.push('KEEPTTL');
    }
    else if (params.duration) {
      extraParams.push('PX');
      extraParams.push(params.duration);
    }

    this.loggerService.debug(`[RedisService] Setting key ${params.key}...`);

    await this.redisClient.set(
      params.key,
      JSON.stringify(params.value),
      ...extraParams,
    );
  }

  /**
   * Deletes desired key.
   * @param key
   */
  public async delKey(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  /**
   * Sets a key given desired configuration and returns
   * its current value after the update.
   * @param params
   */
  public async setGetKey<T>(params: RedisSetParams): Promise<T> {
    await this.setKey(params);
    return this.getKey(params.key);
  }

  /**
   * Ensures that desired key is not in use before resolving.
   * Used to guarantee that multiple routines do not access
   * the same resource concurrently.
   * @param key
   * @param duration
   */
  public async lockKey(key: string, duration?: number): Promise<void> {
    const defaultLockDuration = 5000;
    const lockRetryHalt = 500;
    const lockValue = v4();

    this.loggerService.debug(`[RedisService] Attempting to lock key ${key}...`);
    const currentValue = await this.setGetKey({
      key,
      value: lockValue,
      skip: 'IF_EXIST',
      duration: duration || defaultLockDuration,
    });

    if (currentValue !== lockValue) {
      this.loggerService.debug(`[RedisService] Locking key ${key} failed, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, lockRetryHalt));
      return this.lockKey(key, duration);
    }

    this.loggerService.debug(`[RedisService] Key ${key} locked successfully!`);
  }

}
