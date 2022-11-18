import { PoeQueriesService } from './poe-queries.service';
import { PoeQueriesController } from './poe-queries-controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PoeQueriesController],
  providers: [PoeQueriesService],
})
export class PoeQueriesModule {}
