import { Inject, Injectable, InternalServerErrorException, LoggerService } from '@bechara/nestjs-core';
import Redis from 'ioredis';
import { v4 } from 'uuid';

import { RedisInjectionToken } from './redis.enum';
import { RedisModuleOptions, RedisSetOptions } from './redis.interface';

@Injectable()
export class RedisService {

  private defaultTtl = 60 * 1000;
  private redisClient: Redis.Redis;

  public constructor(
    @Inject(RedisInjectionToken.REDIS_MODULE_OPTIONS)
    private readonly redisModuleOptions: RedisModuleOptions,
    private readonly loggerService: LoggerService,
  ) {
    this.setupRedis();
  }

  /**
   * Sets up the redis cloud client, if reconnect procedure
   * is not provided use the default below.
   */
  private setupRedis(): void {
    if (!this.redisModuleOptions?.host) {
      this.loggerService.warning('[RedisService] Client connection disabled due to missing host');
      return;
    }

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
    if (!this.redisClient) {
      throw new InternalServerErrorException('[RedisService] Redis client unavailable');
    }

    return this.redisClient;
  }

  /**
   * Reads given key and parse its value.
   * @param key
   */
  public async getKey<T>(key: string): Promise<T> {
    this.loggerService.debug(`[RedisService] Reading key ${key}...`);

    const stringValue = await this.getClient().get(key);
    return JSON.parse(stringValue);
  }

  /**
   * When setting a key always stringify it to preserve
   * type information.
   * @param key
   * @param value
   * @param options
   */
  public async setKey(key: string, value: any, options: RedisSetOptions = { }): Promise<void> {
    this.loggerService.debug(`[RedisService] Setting key ${key}...`);

    options.ttl ??= this.defaultTtl;
    const extraParams = [ ];

    if (options.skip === 'IF_EXIST') extraParams.push('NX');
    if (options.skip === 'IF_NOT_EXIST') extraParams.push('XX');

    if (options.keepTtl) {
      extraParams.push('KEEPTTL');
    }
    else if (options.ttl) {
      extraParams.push('PX');
      extraParams.push(options.ttl);
    }

    await this.getClient().set(key, JSON.stringify(value), ...extraParams);
  }

  /**
   * Deletes desired key.
   * @param key
   */
  public async delKey(key: string): Promise<void> {
    await this.getClient().del(key);
  }

  /**
   * Sets a key given desired configuration and returns
   * its current value after the update.
   * @param key
   * @param value
   * @param options
   */
  public async setGetKey<T>(key: string, value: any, options: RedisSetOptions = { }): Promise<T> {
    await this.setKey(key, value, options);
    return this.getKey(key);
  }

  /**
   * Attempt to acquire the lock of a key which might
   * be being used by other concurrent processes.
   * Uses a pseudo key ended with _LOCK to ensure
   * original value is not modified.
   * @param key
   * @param ttl
   */
  public async lockKey(key: string, ttl: number = this.defaultTtl): Promise<void> {
    this.loggerService.debug(`[RedisService] Locking key ${key}...`);

    const lockKey = `${key}_LOCK`;
    const lockValue = v4();
    const lockHalt = 500;

    const currentValue = await this.setGetKey(lockKey, lockValue, { ttl, skip: 'IF_EXIST' });

    if (currentValue !== lockValue) {
      this.loggerService.debug(`[RedisService] Locking key ${key} failed, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, lockHalt));
      return this.lockKey(key, ttl);
    }

    this.loggerService.debug(`[RedisService] Key ${key} locked successfully!`);
  }

  /**
   * Removes the pseudo key used by lock.
   * @param key
   * @returns
   */
  public async unlockKey(key: string): Promise<void> {
    return this.delKey(`${key}_LOCK`);
  }

}
