import { Module } from '@nestjs/common';
import { FlipCardsModule } from '../flip-cards/flip-cards.module';
import { PoeDataController } from './poe-data.controller';
import { PoeDataService } from './poe-data.service';

@Module({
  imports: [FlipCardsModule],
  controllers: [PoeDataController],
  providers: [PoeDataService],
})
export class PoeDataModule {}
