import { PoeDataModule } from './poe-data/poe-data.module';
import { PoeQueriesModule } from './poe-queries/poe-queries-module';
import { Module } from '@nestjs/common';
import { CardPoeDataModule } from './card-poe-data/card-poe-data.module';
import { PoeFetchModule } from './poe-fetch/poe-fetch.module';

@Module({
  imports: [PoeDataModule, PoeQueriesModule, CardPoeDataModule, PoeFetchModule],
})
export class AppModule {}
