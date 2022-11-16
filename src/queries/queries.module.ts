import { QueriesService } from './queries.service';
import { QueriesController } from './queries.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [QueriesController],
  providers: [QueriesService],
})
export class QueriesModule {}
