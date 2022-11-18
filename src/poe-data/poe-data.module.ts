import { Module } from '@nestjs/common';
import { PoeDataService } from './poe-data.service';
import { CardPoeDataService } from '../card-poe-data/card-poe-data.service';
import { PoeDataController } from './poe-data.controller';

@Module({
  imports: [CardPoeDataService],
  controllers: [PoeDataController],
  providers: [PoeDataService],
})
export class PoeDataModule {}
