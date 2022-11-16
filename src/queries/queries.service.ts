import { Injectable } from '@nestjs/common';
import { QueriesItemsFile } from './interface/queries.interface';
import {
  loadAnyFile,
  namesFile,
  saveAnyJsonInFile,
} from '../tools/workingWithFile';
import { QueriesUpdateDto } from './dto/queries-update.dto';
import * as fs from 'fs';

@Injectable()
export class QueriesService {
  async onModuleInit() {
    const isHaveFile = fs.existsSync(namesFile.poeQueries);
    if (!isHaveFile) {
      await saveAnyJsonInFile(namesFile.poeQueries, []);
    }
  }
  async getQueries(): Promise<QueriesItemsFile[] | []> {
    return loadAnyFile(namesFile.poeQueries);
  }

  async editQueries(queriesUpdate: QueriesUpdateDto[]): Promise<void> {
    await saveAnyJsonInFile(namesFile.poeQueries, queriesUpdate);
  }
}
