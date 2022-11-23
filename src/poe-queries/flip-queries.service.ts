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
import { QueriesItems } from './interface/queries.interface';

@Injectable()
export class FlipQueriesService {
  uploadedFileQueries: QueriesItems[];

  async onModuleInit() {
    const isHaveFile = fileExist(fileNamesEnum.POE_QUERIES_SEARCH);
    if (!isHaveFile) {
      await saveAnyJsonInFile(fileNamesEnum.POE_QUERIES_SEARCH, []);
      this.uploadedFileQueries = [];
    } else {
      this.uploadedFileQueries = await loadAnyFile(
        fileNamesEnum.POE_QUERIES_SEARCH,
      );
    }
  }

  async getQueries() {
    return this.uploadedFileQueries;
  }

  async editQueries(queriesUpdate: QueryFlipDto) {
    this.uploadedFileQueries = this.uploadedFileQueries.map((el) => {
      return el.uuid !== queriesUpdate.uuid ? el : queriesUpdate;
    });
    await saveAnyJsonInFile(
      fileNamesEnum.POE_QUERIES_SEARCH,
      this.uploadedFileQueries,
    );
  }

  async addQuery(flipQuery: AddFlipQueryDto) {
    const newQuery = { ...flipQuery, uuid: uuid.v1() };
    this.uploadedFileQueries = [...this.uploadedFileQueries, newQuery];

    await saveAnyJsonInFile(
      fileNamesEnum.POE_QUERIES_SEARCH,
      this.uploadedFileQueries,
    );
  }

  async removeQueries(flipQuery: QueryFlipDto) {
    this.uploadedFileQueries = this.uploadedFileQueries.filter(
      (el) => el.uuid !== flipQuery.uuid,
    );
    await saveAnyJsonInFile(
      fileNamesEnum.POE_QUERIES_SEARCH,
      this.uploadedFileQueries,
    );
  }
}
