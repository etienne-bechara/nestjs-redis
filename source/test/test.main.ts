import { AppModule } from '@bechara/nestjs-core';

import { CacheConfig } from './cache/cache.config';
import { CacheModule } from './cache/cache.module';

/**
 * Fully boots all modules for testing purposes.
 */
void AppModule.bootServer({
  disableModuleScan: true,
  modules: [ CacheModule ],
  configs: [ CacheConfig ],
});
