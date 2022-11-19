import { Module } from '@nestjs/common';
import { PoeDataService } from './poe-data.service';
import { PoeDataController } from './poe-data.controller';
import { CardPoeDataModule } from '../card-poe-data/card-poe-data.module';

@Module({
  imports: [CardPoeDataModule],
  controllers: [PoeDataController],
  providers: [PoeDataService],
})
export class PoeDataModule {}
