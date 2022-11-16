import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PoeFetchService } from './poe-fetch.service';

@Module({
  exports: [PoeFetchService],
  imports: [HttpModule],
  controllers: [],
  providers: [PoeFetchService],
})
export class PoeFetchModule {}
