import { Injectable, InjectSecret } from '@bechara/nestjs-core';
import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUrl } from 'class-validator';

@Injectable()
export class RedisConfig {

  @IsOptional()
  @InjectSecret()
  @IsUrl()
  public readonly REDIS_HOST: string;

  @IsOptional()
  @InjectSecret()
  @IsNumberString()
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
