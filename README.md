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

Import `RedisModule` into the domain you wish to use it, followed by injecting the `RedisService` at your desired provider.

**Example**

```ts
@Injectable()
export class UserService {}

  public constructor(
    private readonly redisService: RedisService,
  ) { }

}
```

The following methods will be available at `this.redisService`:

```ts
// Returns the underlying client for native operations
getClient(): Redis.Redis

// Gets a key serializing the output
getKey<T>(key: string): Promise<T>;

// Sets a key serializing the input and allowing custom options
setKey(params: RedisSetParams): Promise<void>;

// Sets a key and read its updated value
setGetKey<T>(params: RedisSetParams): Promise<T>;

// Deletes a key
deleteKey(key: string): Promise<void>;

// Increments a counter and returns current value
incrementKey(key: string, amount: number, options: RedisIncrementOptions): Promise<number>;

// Attempt to lock a key ensuring no other concurrent operation is using it
lockKey(key: string, options: RedisLockOptions): Promise<void>;

// Removes the lock from previously locked key
unlockKey(key: string): Promise<void>;
```

## Full Example

Refer to `test` folder of this project for a full working example.
