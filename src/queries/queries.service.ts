import { Injectable } from '@nestjs/common';
import {
  fileNamesEnum,
  loadAnyFile,
  QueriesItemsFileType,
  saveAnyJsonInFile,
} from '../tools/workingWithFile';
import { QueriesUpdateDto } from './dto/queries-update.dto';
import * as fs from 'fs';

@Injectable()
export class QueriesService {
  async onModuleInit() {
    const isHaveFile = fs.existsSync(fileNamesEnum.POE_QUERIES_SEARCH);
    if (!isHaveFile) {
      await saveAnyJsonInFile(fileNamesEnum.POE_QUERIES_SEARCH, []);
    }
  }
  async getQueries(): Promise<QueriesItemsFileType> {
    return loadAnyFile(fileNamesEnum.POE_QUERIES_SEARCH);
  }

  async editQueries(queriesUpdate: QueriesUpdateDto[]): Promise<void> {
    await saveAnyJsonInFile(fileNamesEnum.POE_QUERIES_SEARCH, queriesUpdate);
  }
}
