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

    describe('deleteKey', () => {
      it('should delete persisted random number', async () => {
        await redisService.deleteKey(testKey);
        const testValue = await redisService.getKey(testKey);
        expect(testValue).toBeNull();
      });
    });

    describe('incrementKey', () => {
      it('should increment a key by integer amount', async () => {
        const incrementKey = v4();
        const interactions = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
        const incrementAmount = 1;

        for (let i = 0; i < interactions; i++) {
          void redisService.incrementKey(incrementKey, incrementAmount);
        }

        const testValue = await redisService.getKey(incrementKey);
        expect(testValue).toBe(interactions * incrementAmount);
      });

      it('should increment a key by float amount', async () => {
        const incrementKey = v4();
        const interactions = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
        const incrementAmount = Math.random();

        for (let i = 0; i < interactions; i++) {
          void redisService.incrementKey(incrementKey, incrementAmount);
        }

        const testValue = await redisService.getKey(incrementKey);
        expect(testValue).toBe(interactions * incrementAmount);
      });

      it('should increment a key without resetting ttl', async () => {
        const incrementKey = v4();

        for (let i = 0; i < 10; i++) {
          void redisService.incrementKey(incrementKey, 1, { ttl: 2000 });
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        await new Promise((resolve) => setTimeout(resolve, 1100));

        const testValue = await redisService.getKey(incrementKey);
        expect(testValue).toBeNull();
      });

      it('should decrement a key if input is negative', async () => {
        const incrementKey = v4();

        await redisService.incrementKey(incrementKey, 10);
        await redisService.incrementKey(incrementKey, -3);

        const testValue = await redisService.getKey(incrementKey);
        expect(testValue).toBe(7);
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
            redisService.lockKey(lockKey, { ttl }),
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

        await redisService.lockKey(lockKey, { ttl });
        await redisService.unlockKey(lockKey);
        await redisService.lockKey(lockKey, { ttl });

        const elapsed = Date.now() - start;
        expect(elapsed).toBeLessThan(ttl);
      });

      it('should try once and throw if retries are zero', async () => {
        const lockKey = v4();
        const ttl = 1000;
        let exception: boolean;

        await redisService.lockKey(lockKey, { ttl });

        try {
          await redisService.lockKey(lockKey, {
            retries: 0,
            delay: ttl * 2,
            ttl,
          });
        }
        catch {
          exception = true;
        }

        expect(exception).toBeTruthy();
      });
    });
  },

});
