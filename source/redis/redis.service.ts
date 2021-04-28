import { Inject, Injectable, InternalServerErrorException, LoggerService, UtilService } from '@bechara/nestjs-core';
import Redis from 'ioredis';
import { v4 } from 'uuid';

import { RedisInjectionToken } from './redis.enum';
import { RedisIncrementOptions, RedisLockOptions, RedisModuleOptions, RedisSetOptions } from './redis.interface';

@Injectable()
export class RedisService {

  private redisClient: Redis.Redis;
  private initialized: boolean;
  private defaultTtl = 60 * 1000;

  public constructor(
    @Inject(RedisInjectionToken.REDIS_MODULE_OPTIONS)
    private readonly redisModuleOptions: RedisModuleOptions,
    private readonly loggerService: LoggerService,
    private readonly utilService: UtilService,
  ) {
    this.redisModuleOptions ??= { };

    if (!this.redisModuleOptions?.host) {
      this.loggerService.warning('[RedisService] Client connection disabled due to missing host');
      return;
    }

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
    this.initialized = true;
    this.loggerService.notice(`[RedisService] Client connected at ${redisHost}`);
  }

  /**
   * Returns whether or not the client has been initialized.
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Returns the underlying client.
   */
  public getClient(): Redis.Redis {
    if (!this.isInitialized()) {
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
      extraParams.push('PX', options.ttl);
    }

    await this.getClient().set(key, JSON.stringify(value), ...extraParams);
  }

  /**
   * Deletes desired key.
   * @param key
   */
  public async deleteKey(key: string): Promise<void> {
    this.loggerService.debug(`[RedisService] Deleting key ${key}...`);
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
   * Increments a key and return its current counter.
   * If it does not exist create it with given ttl.
   * @param key
   * @param amount
   * @param options
   */
  public async incrementKey(key: string, amount: number = 1, options: RedisIncrementOptions = { }): Promise<number> {
    this.loggerService.debug(`[RedisService] Incrementing key ${key}...`);
    options.ttl ??= this.defaultTtl;

    const counter = await this.getClient().incrby(key, amount);

    if (counter === 1) {
      await this.getClient().expire(key, options.ttl / 1000);
    }

    return counter;
  }

  /**
   * Attempt to acquire the lock of a key which might
   * be being used by other concurrent processes.
   * Uses a pseudo key ended with _LOCK to ensure
   * original value is not modified.
   * @param key
   * @param options
   */
  public async lockKey(key: string, options: RedisLockOptions = { }): Promise<void> {
    this.loggerService.debug(`[RedisService] Locking key ${key}...`);
    options.ttl ??= this.defaultTtl;

    const lockKey = `${key}_LOCK`;
    const lockValue = v4();

    await this.utilService.retryOnException({
      name: 'lockKey()',
      delay: options.delay,
      retries: options.retries,
      timeout: options.timeout,
      method: async () => {
        const currentValue = await this.setGetKey(lockKey, lockValue, {
          ttl: options.ttl,
          skip: 'IF_EXIST',
        });

        if (currentValue !== lockValue) {
          throw new InternalServerErrorException({
            message: `[RedisService] Failed to lock key ${key}`,
            options,
          });
        }
      },
    });

    this.loggerService.debug(`[RedisService] Key ${key} locked successfully!`);
  }

  /**
   * Removes the pseudo key used by lock.
   * @param key
   * @returns
   */
  public async unlockKey(key: string): Promise<void> {
    this.loggerService.debug(`[RedisService] Unlocking key ${key}...`);
    return this.deleteKey(`${key}_LOCK`);
  }

}
