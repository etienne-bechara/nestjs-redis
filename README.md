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
REDIS_USERNAME='redis'
REDIS_PASSWORD='*****'
```

It is recommended that you have a local database in order to test connectivity.


3\. Import `RedisModule` and `RedisConfig` into you boot script and configure asynchronously:

```ts
import { AppModule } from '@bechara/nestjs-core';
import { RedisConfig } from '@bechara/nestjs-redis';
import { RedisModule } from '@bechara/nestjs-redis';

void AppModule.bootServer({
  configs: [ RedisConfig ],
  imports: [
    RedisModule.registerAsync({
      inject: [ RedisConfig ],
      useFactory: (redisConfig: RedisConfig) => ({
        host: redisConfig.REDIS_HOST,
        port: redisConfig.REDIS_PORT,
        username: redisConfig.REDIS_USERNAME,
        password: redisConfig.REDIS_PASSWORD,
        keepAlive: 1 * 1000,
        // Check more options with Ctrl+Space
      }),
    }),
  ],
  exports: [ RedisModule ],
});
```

If you wish to change how environment variables are injected you may provide your own configuration instead of using the built-in `RedisConfig`.


4\. Boot your application and you should see a successful connection message:

```
2021-03-27 00:02:54  NTC  [RedisService] Client connected at localhost
```


## Usage

Import `RedisModule` into the domain you with to use it followed by injecting the `RedisService` at your desired provider and you shall be able to use one of the built-in methods:

```
getKey<T>(key: string): Promise<T>;
setKey(params: RedisSetParams): Promise<void>;
delKey(key: string): Promise<void>;
setGetKey<T>(params: RedisSetParams): Promise<T>;
lockKey(key: string, ttl?: number): Promise<void>;
```

For complex operation you may acquire the underlying client directly:

```
getClient(): Redis.Redis;
```

## Full Example

Refer to `test` folder of this project for a full working example.
