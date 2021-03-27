import { InjectSecret } from '@bechara/nestjs-core';
import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsUrl } from 'class-validator';

@Injectable()
export class DatabaseConfig {

  @InjectSecret()
  @IsUrl()
  public readonly REDIS_HOST: string;

  @InjectSecret()
  @Transform((v) => Number.parseInt(v.value))
  @IsNumber()
  public readonly REDIS_PORT: number;

  @InjectSecret()
  @IsString()
  public readonly REDIS_PASSWORD: string;

}
