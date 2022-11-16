import { Injectable } from '@nestjs/common';
import { saveAnyJsonInFile, fileNamesEnum } from '../tools/workingWithFile';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PoeDataService {
  async onModuleInit() {
    const isHaveFile = fs.existsSync(
      path.resolve('data', fileNamesEnum.POE_DATA),
    );
    if (!isHaveFile) {
      await saveAnyJsonInFile(fileNamesEnum.POE_DATA, { cards: [], gems: [] });
    }
  }
}
