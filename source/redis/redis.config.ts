import { Injectable, InjectSecret } from '@bechara/nestjs-core';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

@Injectable()
export class RedisConfig {

  @IsOptional()
  @InjectSecret()
  @IsUrl()
  public readonly REDIS_HOST: string;

  @IsOptional()
  @InjectSecret()
  @Transform((v) => Number.parseInt(v.value))
  @IsNumber()
  public readonly REDIS_PORT: number;

  @IsOptional()
  @InjectSecret()
  @IsString() @IsNotEmpty()
  public readonly REDIS_USERNAME: string;

  @IsOptional()
  @InjectSecret()
  @IsString() @IsNotEmpty()
  public readonly REDIS_PASSWORD: string;

}
