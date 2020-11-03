import { InjectSecret } from '@bechara/nestjs-core';
import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsUrl } from 'class-validator';

@Injectable()
export class RedisConfig {

  @InjectSecret()
  @IsUrl()
  public readonly REDIS_HOST: string;

  @InjectSecret()
  @Transform((v) => Number.parseInt(v))
  @IsNumber()
  public readonly REDIS_PORT: number;

  @InjectSecret()
  @IsString()
  public readonly REDIS_PASSWORD: string;

  @InjectSecret({ default: '' })
  @IsString()
  public readonly REDIS_KEY_PREFIX: string;

  @InjectSecret({ default: 5000 })
  @IsNumber()
  public readonly REDIS_LOCK_DEFAULT_DURATION: number;

}
