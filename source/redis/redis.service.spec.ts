import { InjectSecret } from '@bechara/nestjs-core';
import { TestModule } from '@bechara/nestjs-core/dist/test';
import { Global, Injectable, Module } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsUrl } from 'class-validator';
import { v4 } from 'uuid';

import { RedisModule } from './redis.module';
import { RedisService } from './redis.service';

@Injectable()
class RedisTestConfig {

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

@Global()
@Module({
  imports: [
    RedisModule.registerAsync({
      inject: [ RedisTestConfig ],
      useFactory: (redisTestConfig: RedisTestConfig) => ({
        host: redisTestConfig.REDIS_HOST,
        port: redisTestConfig.REDIS_PORT,
        password: redisTestConfig.REDIS_PASSWORD,
        keepAlive: 1 * 1000,
      }),
    }),
  ],
  providers: [ RedisTestConfig ],
  exports: [ RedisTestConfig ],
})
class RedisTestModule { }

TestModule.createSandbox({
  name: 'RedisService',
  imports: [ RedisTestModule ],
  configs: [ RedisTestConfig ],

  descriptor: (testingBuilder: TestingModuleBuilder) => {
    const testKey = v4();
    const rng = Math.random();
    let redisService: RedisService;

    beforeAll(async () => {
      const testingModule = await testingBuilder.compile();
      redisService = testingModule.get(RedisService);
    });

    describe('setKey', () => {
      it('should obey skip if not exist rule', async () => {
        await redisService.setKey({
          key: testKey,
          value: { rng },
          skip: 'IF_NOT_EXIST',
        });
        const storedNumber = await redisService.getKey(testKey);
        expect(storedNumber).toBeNull();
      });

      it('should persist a random number', async () => {
        expect(await redisService.setKey({
          key: testKey,
          value: { rng },
        }))
          .toBeUndefined();
      });

      it('should obey skip if exist rule', async () => {
        await redisService.setKey({
          key: testKey,
          value: Math.random(),
          skip: 'IF_EXIST',
        });
        const storedNumber = await redisService.getKey(testKey);
        expect(storedNumber).toMatchObject({ rng });
      });
    });

    describe('getKey', () => {
      it('should read persisted random number', async () => {
        const storedNumber = await redisService.getKey(testKey);
        expect(storedNumber).toMatchObject({ rng });
      });
    });

    describe('delKey', () => {
      it('should delete persisted random number', async () => {
        await redisService.delKey(testKey);
        const testValue = await redisService.getKey(testKey);
        expect(testValue).toBeNull();
      });
    });

    describe('lockKey', () => {
      it('should disallow locking the same key at the same time', async () => {
        const lockKey = v4();
        const start = new Date().getTime();
        const duration = 500;
        const instances = 5;
        const lockPromises = [ ];

        for (let i = 0; i < instances; i++) {
          lockPromises.push(
            redisService.lockKey(lockKey, duration),
          );
        }

        await Promise.all(lockPromises);

        const elapsed = new Date().getTime() - start;
        expect(elapsed).toBeGreaterThan(duration * (instances - 1));
      });
    });
  },

});
