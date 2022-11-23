import { Module } from '@nestjs/common';
import { CardPoeDataModule } from './card-poe-data/card-poe-data.module';
import { PoeDataModule } from './poe-data/poe-data.module';
import { PoeFetchModule } from './poe-fetch/poe-fetch.module';
import { FlipQueriesModule } from './poe-queries/flip-queries-module';

@Module({
  imports: [
    PoeDataModule,
    FlipQueriesModule,
    CardPoeDataModule,
    PoeFetchModule,
  ],
})
export class AppModule {}
