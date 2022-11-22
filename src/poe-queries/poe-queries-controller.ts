import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AddFlipQueryDto } from './dto/add-flip-query.dto';
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
  async add(@Body() addFlipQueryDto: AddFlipQueryDto) {
    await this._queriesService.addQuery(addFlipQueryDto);
  }

  @Delete()
  async delete(@Body() queryFlipDto: QueryFlipDto) {
    await this._queriesService.removeQueries(queryFlipDto);
  }
}
