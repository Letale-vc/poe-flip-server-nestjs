import { Module } from '@nestjs/common';
import { FlipCardsModule } from './flip-cards/flip-cards.module';
import { FlipQueriesModule } from './flip-queries/flip-queries-module';
import { PoeDataModule } from './poe-data/poe-data.module';
import { PoeFetchModule } from './poe-fetch/poe-fetch.module';

@Module({
  imports: [PoeDataModule, FlipQueriesModule, FlipCardsModule, PoeFetchModule],
})
export class AppModule {}
