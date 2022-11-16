import { Module } from '@nestjs/common';
import { PoeDataService } from './poe-data.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PoeDataService],
})
export class PoeDataModule {}
