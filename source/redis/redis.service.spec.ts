import { TestModule } from '@bechara/nestjs-core/dist/test';
import { TestingModuleBuilder } from '@nestjs/testing';
import { v4 } from 'uuid';

import { RedisConfig } from './redis.config';
import { RedisService } from './redis.service';

TestModule.createSandbox({
  name: 'RedisService',
  providers: [ RedisConfig, RedisService ],
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
        await redisService.setKey({
          key: testKey,
          value: { rng },
          skip: 'IF_NOT_EXIST',
        });
        const storedNumber = await redisService.getKey(testKey);
        expect(storedNumber).toBeNull();
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

      it('should persist a random number', async () => {
        expect(await redisService.setKey({
          key: testKey,
          value: { rng },
        }))
          .toBeUndefined();
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
