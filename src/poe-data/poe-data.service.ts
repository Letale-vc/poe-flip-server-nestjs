import { Injectable } from '@nestjs/common';
import { saveAnyJsonInFile, namesFile } from '../tools/workingWithFile';
import * as fs from 'fs';

@Injectable()
export class PoeDataService {
  async onModuleInit() {
    const isHaveFile = fs.existsSync(namesFile.poeData);
    if (!isHaveFile) {
      await saveAnyJsonInFile(namesFile.poeData, { cards: [], gems: [] });
    }
  }
}
