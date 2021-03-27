# NestJS Redis Component

This package acts as a plugin for [NestJS Core Components](https://github.com/etienne-bechara/nestjs-core) and adds Redis database connection and manipulation methods.


## Installation

The following instructions considers you already have a project set up with [@bechara/nestjs-core](https://www.npmjs.com/package/@bechara/nestjs-core).

If not, please refer to documentation above before proceeding.


1\. Install the new necessary dependencies:

```
npm i @bechara/nestjs-redis
```


2\. Add these example variables to your `.env` (adjust accordingly):

```
REDIS_HOST='localhost'
REDIS_PORT=16420
REDIS_PASSWORD='xxx'
```

It is recommended that you have a local database in order to test connectivity.


3\. Create a new folder at your `source` to be responsible for handling the connection configuration. For this example we shall name it `database`.


4\. Create environment injection file at `database.config.ts`, you may copy the template below in order to have built-in validation:

```ts
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
```

5\. Create the connection module wrapper at `database.module.ts`:

```ts
import { RedisModule } from '@bechara/nestjs-redis';
import { Module } from '@nestjs/common';

import { DatabaseConfig } from './database.config';

@Module({
  imports: [
    RedisModule.registerAsync({
      inject: [ DatabaseConfig ],
      useFactory: (databaseConfig: DatabaseConfig) => ({
        host: databaseConfig.REDIS_HOST,
        port: databaseConfig.REDIS_PORT,
        password: databaseConfig.REDIS_PASSWORD,
        keepAlive: 1 * 1000,
        // You may add several other options, check with Ctrl+Space
      }),
    }),
  ],
  providers: [ DatabaseConfig ],
  exports: [ DatabaseConfig ],
})
export class DatabaseModule { }
```

6\. Boot your application and you should see a successful connection message:

```
2021-03-27 00:02:54  NTC  [RedisService] Client connected at localhost
```


## Usage

Simply inject the `RedisService` at your desired provider and you shall be able to use one of the built-in methods:

```
getKey<T>(key: string): Promise<T>;
setKey(params: RedisSetParams): Promise<void>;
delKey(key: string): Promise<void>;
setGetKey<T>(params: RedisSetParams): Promise<T>;
lockKey(key: string, duration?: number): Promise<void>;
```

For complex operation you may acquire the underlying client directly:

```
getClient(): Redis.Redis;
```

## Full Example

Refer to `test` folder of this project for a full working example.
