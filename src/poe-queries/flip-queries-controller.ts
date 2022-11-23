import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AddFlipQueryDto } from './dto/add-flip-query.dto';
import { QueryFlipDto } from './dto/queries-update.dto';
import { FlipQueriesValidBody } from './flip-queries.decorator';
import { FlipQueriesService } from './flip-queries.service';
import { QueriesItems } from './interface/queries.interface';

@Controller('flipQueries')
export class FlipQueriesController {
  constructor(private flipQueriesService: FlipQueriesService) {}

  @Get()
  async getAll(): Promise<QueriesItems[]> {
    return await this.flipQueriesService.getQueries();
  }

  @Put()
  async update(@FlipQueriesValidBody() queryFlipDto: QueryFlipDto) {
    await this.flipQueriesService.editQueries(queryFlipDto);
  }

  @Post()
  async add(@FlipQueriesValidBody() addFlipQueryDto: AddFlipQueryDto) {
    await this.flipQueriesService.addQuery(addFlipQueryDto);
  }

  @Delete()
  async delete(@FlipQueriesValidBody() queryFlipDto: QueryFlipDto) {
    await this.flipQueriesService.removeQueries(queryFlipDto);
  }
}
