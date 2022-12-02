import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import {
  fileExist,
  fileNamesEnum,
  loadAnyFile,
  saveAnyJsonInFile,
} from '../tools/workingWithFile';
import { AddFlipQueryDto } from './dto/add-flip-query.dto';
import { QueryFlipDto } from './dto/queries-update.dto';

@Injectable()
export class FlipQueriesService {
  async onModuleInit() {
    const isHaveFile = fileExist(fileNamesEnum.POE_QUERIES_SEARCH);
    if (!isHaveFile) {
      await saveAnyJsonInFile(fileNamesEnum.POE_QUERIES_SEARCH, []);
    }
  }

  async getQueries() {
    return await loadAnyFile(fileNamesEnum.POE_QUERIES_SEARCH);
  }

  async editQueries(queriesUpdate: QueryFlipDto) {
    const oldFlipQueries = await loadAnyFile(fileNamesEnum.POE_QUERIES_SEARCH);
    const newFlipQueries = oldFlipQueries.map((el) => {
      return el.uuid !== queriesUpdate.uuid ? el : queriesUpdate;
    });
    await saveAnyJsonInFile(fileNamesEnum.POE_QUERIES_SEARCH, newFlipQueries);
  }

  async addQuery(flipQuery: AddFlipQueryDto) {
    const oldFlipQueries = await loadAnyFile(fileNamesEnum.POE_QUERIES_SEARCH);
    const newQuery = { ...flipQuery, uuid: uuid.v1() };
    const newFlipQueries = [...oldFlipQueries, newQuery];

    await saveAnyJsonInFile(fileNamesEnum.POE_QUERIES_SEARCH, newFlipQueries);
  }

  async removeQueries(flipQuery: QueryFlipDto) {
    const oldFlipQueries = await loadAnyFile(fileNamesEnum.POE_QUERIES_SEARCH);
    const newFlipQueries = oldFlipQueries.filter(
      (el) => el.uuid !== flipQuery.uuid,
    );
    await saveAnyJsonInFile(fileNamesEnum.POE_QUERIES_SEARCH, newFlipQueries);
  }
}
