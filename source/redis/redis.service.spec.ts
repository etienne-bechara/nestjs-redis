import { TestModule } from '@bechara/nestjs-core/dist/test';
import { TestingModuleBuilder } from '@nestjs/testing';
import { v4 } from 'uuid';

import { RedisConfig } from './redis.config';
import { RedisModule } from './redis.module';
import { RedisService } from './redis.service';

TestModule.createSandbox({
  name: 'RedisService',
  imports: [
    RedisModule.registerAsync({
      inject: [ RedisConfig ],
      useFactory: (redisConfig: RedisConfig) => ({
        host: redisConfig.REDIS_HOST,
        port: redisConfig.REDIS_PORT,
        username: redisConfig.REDIS_USERNAME,
        password: redisConfig.REDIS_PASSWORD,
        keepAlive: 1 * 1000,
      }),
    }),
  ],
  configs: [ RedisConfig ],

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
        await redisService.setKey(testKey, { rng }, { skip: 'IF_NOT_EXIST' });
        const storedNumber = await redisService.getKey(testKey);
        expect(storedNumber).toBeNull();
      });

      it('should persist a random number', async () => {
        expect(await redisService.setKey(testKey, { rng })).toBeUndefined();
      });

      it('should obey skip if exist rule', async () => {
        await redisService.setKey(testKey, Math.random(), { skip: 'IF_EXIST' });
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
        const start = Date.now();
        const ttl = 500;
        const instances = 5;
        const lockPromises = [ ];

        for (let i = 0; i < instances; i++) {
          lockPromises.push(
            redisService.lockKey(lockKey, ttl),
          );
        }

        await Promise.all(lockPromises);

        const elapsed = Date.now() - start;
        expect(elapsed).toBeGreaterThan(ttl * (instances - 1));
      });

      it('should allow locking the same key if it has been unlocked', async () => {
        const lockKey = v4();
        const start = Date.now();
        const ttl = 5000;

        await redisService.lockKey(lockKey);
        await redisService.unlockKey(lockKey);
        await redisService.lockKey(lockKey);

        const elapsed = Date.now() - start;
        expect(elapsed).toBeLessThan(ttl);
      });
    });
  },

});
