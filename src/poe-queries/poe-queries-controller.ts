import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { QueryFlipDto } from './dto/queries-update.dto';
import { QueriesItems } from './interface/queries.interface';
import { PoeQueriesService } from './poe-queries.service';

@Controller('poeQueries')
export class PoeQueriesController {
  constructor(private _queriesService: PoeQueriesService) {}

  @Get()
  async getAll(): Promise<QueriesItems[]> {
    return await this._queriesService.getQueries();
  }

  @Put()
  async update(@Body() queryFlipDto: QueryFlipDto) {
    await this._queriesService.editQueries(queryFlipDto);
  }

  @Post()
  async add(@Body() queryFlipDto: QueryFlipDto) {
    await this._queriesService.addQuery(queryFlipDto);
  }

  @Delete()
  async delete(@Body() queryFlipDto: QueryFlipDto) {
    await this._queriesService.removeQueries(queryFlipDto);
  }
}
