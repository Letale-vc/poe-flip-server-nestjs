import { Injectable } from '@nestjs/common';
import {
  fileExist,
  fileNamesEnum,
  loadAnyFile,
  QueriesItemsFileType,
  saveAnyJsonInFile,
} from '../tools/workingWithFile';
import { QueriesUpdateDto } from './dto/queries-update.dto';

@Injectable()
export class PoeQueriesService {
  async onModuleInit() {
    const isHaveFile = fileExist(fileNamesEnum.POE_QUERIES_SEARCH);
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
