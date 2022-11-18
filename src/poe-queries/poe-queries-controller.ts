import { Body, Controller, Get, Post } from '@nestjs/common';
import { QueriesUpdateDto } from './dto/queries-update.dto';
import { QueriesItems } from './interface/queries.interface';
import { PoeQueriesService } from './poe-queries.service';

@Controller('poeQueries')
export class PoeQueriesController {
  constructor(private _queriesService: PoeQueriesService) {}

  @Get()
  async getAll(): Promise<QueriesItems[]> {
    return await this._queriesService.getQueries();
  }

  @Post()
  async update(@Body() queriesUpdate: QueriesUpdateDto[]): Promise<void> {
    await this._queriesService.editQueries(queriesUpdate);
  }
}
