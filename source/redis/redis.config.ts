import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisConfig {

  // 5 seconds
  public readonly REDIS_DEFAULT_LOCK_DURATION = 5 * 1000;

  // 0.5 seconds
  public readonly REDIS_DEFAULT_LOCK_RETRY = 500;

}
