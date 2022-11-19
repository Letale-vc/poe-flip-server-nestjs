import { Controller, Get, Put } from '@nestjs/common';
import { PoeDataService } from './poe-data.service';

@Controller('poe-data')
export class PoeDataController {
  constructor(private readonly _poeDataService: PoeDataService) {}

  @Put()
  async update() {
    void this._poeDataService.startUpdate();
  }

  @Get()
  async get() {
    return await this._poeDataService.takePoeData();
  }
}
