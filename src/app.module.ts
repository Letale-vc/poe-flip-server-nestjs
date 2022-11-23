import { Module } from '@nestjs/common';
import { CardPoeDataModule } from './card-poe-data/card-poe-data.module';
import { FlipQueriesModule } from './flip-queries/flip-queries-module';
import { PoeDataModule } from './poe-data/poe-data.module';
import { PoeFetchModule } from './poe-fetch/poe-fetch.module';

@Module({
  imports: [
    PoeDataModule,
    FlipQueriesModule,
    CardPoeDataModule,
    PoeFetchModule,
  ],
})
export class AppModule {}
