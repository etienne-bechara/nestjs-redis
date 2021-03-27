import { AppModule } from '@bechara/nestjs-core';

import { DatabaseConfig } from './database/database.config';
import { DatabaseModule } from './database/database.module';

/**
 * Fully boots all modules for testing purposes.
 */
void AppModule.bootServer({
  disableModuleScan: true,
  modules: [ DatabaseModule ],
  configs: [ DatabaseConfig ],
});
