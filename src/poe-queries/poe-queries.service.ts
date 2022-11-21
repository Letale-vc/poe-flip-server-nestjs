import { Injectable } from '@nestjs/common';
import {
  fileExist,
  fileNamesEnum,
  loadAnyFile,
  QueriesItemsFileType,
  saveAnyJsonInFile
} from '../tools/workingWithFile';
import { QueryFlipDto } from './dto/queries-update.dto';
import { QueriesItems } from './interface/queries.interface';

@Injectable()
export class PoeQueriesService {
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

  async getQueries(): Promise<QueriesItemsFileType> {
    return loadAnyFile(fileNamesEnum.POE_QUERIES_SEARCH);
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

  async addQuery(queriesUpdate: QueryFlipDto) {
    this.uploadedFileQueries = [...this.uploadedFileQueries, queriesUpdate];

    await saveAnyJsonInFile(
      fileNamesEnum.POE_QUERIES_SEARCH,
      this.uploadedFileQueries,
    );
  }

  async removeQueries(removeFlipQuery: QueryFlipDto) {
    this.uploadedFileQueries = this.uploadedFileQueries.filter(
      (el) => el.uuid !== removeFlipQuery.uuid,
    );
    await saveAnyJsonInFile(
      fileNamesEnum.POE_QUERIES_SEARCH,
      this.uploadedFileQueries,
    );
  }
}
