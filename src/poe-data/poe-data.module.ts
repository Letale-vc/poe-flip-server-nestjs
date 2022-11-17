import { Module } from '@nestjs/common';
import { PoeDataService } from './poe-data.service';
import { CardPoeDataService } from '../card-poe-data/card-poe-data.service';

@Module({
  imports: [CardPoeDataService],
  controllers: [],
  providers: [PoeDataService],
})
export class PoeDataModule {}
