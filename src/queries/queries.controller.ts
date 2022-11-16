import { Body, Controller, Get, Post } from '@nestjs/common';
import { QueriesUpdateDto } from './dto/queries-update.dto';
import { QueriesItems } from './interface/queries.interface';
import { QueriesService } from './queries.service';

@Controller('poeQueries')
export class QueriesController {
  constructor(private _queriesService: QueriesService) {}

  @Get()
  async getAll(): Promise<QueriesItems[]> {
    return await this._queriesService.getQueries();
  }

  @Post()
  async update(@Body() queriesUpdate: QueriesUpdateDto[]): Promise<void> {
    await this._queriesService.editQueries(queriesUpdate);
  }
}
