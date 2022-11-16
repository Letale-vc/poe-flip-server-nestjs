import { Module } from '@nestjs/common';
import { CardPoeDataService } from './card-poe-data.service';
import { PoeFetchModule } from '../poe-fetch/poe-fetch.module';

@Module({
  exports: [CardPoeDataService],
  imports: [PoeFetchModule],
  controllers: [],
  providers: [CardPoeDataService],
})
export class CardPoeDataModule {}
