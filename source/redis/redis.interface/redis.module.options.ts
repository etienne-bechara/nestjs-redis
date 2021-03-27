import { ModuleMetadata } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

export interface RedisAsyncModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
}

export type RedisModuleOptions = RedisOptions;
