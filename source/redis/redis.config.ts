import { Injectable, InjectSecret } from '@bechara/nestjs-core';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

@Injectable()
export class RedisConfig {

  @InjectSecret()
  @IsUrl()
  public readonly REDIS_HOST: string;

  @InjectSecret()
  @Transform((v) => Number.parseInt(v.value))
  @IsNumber()
  public readonly REDIS_PORT: number;

  @InjectSecret()
  @IsOptional()
  @IsString() @IsNotEmpty()
  public readonly REDIS_USERNAME: string;

  @InjectSecret()
  @IsOptional()
  @IsString() @IsNotEmpty()
  public readonly REDIS_PASSWORD: string;

}
