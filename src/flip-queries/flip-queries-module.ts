import { Module } from '@nestjs/common';
import { FlipQueriesController } from './flip-queries-controller';
import { FlipQueriesService } from './flip-queries.service';

@Module({
  imports: [],
  controllers: [FlipQueriesController],
  providers: [FlipQueriesService],
})
export class FlipQueriesModule {}
