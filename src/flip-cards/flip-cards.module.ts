import { Module } from '@nestjs/common';
import { PoeFetchModule } from '../poe-fetch/poe-fetch.module';
import { FlipCardsService } from './flip-cards.service';

@Module({
  exports: [FlipCardsService],
  imports: [PoeFetchModule],
  controllers: [],
  providers: [FlipCardsService],
})
export class FlipCardsModule {}
