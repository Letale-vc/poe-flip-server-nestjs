import { Injectable, Logger } from '@nestjs/common';
import {
  fileInfo,
  fileNamesEnum,
  loadAnyFile,
  saveAnyJsonInFile,
} from '../tools/workingWithFile';
import * as fs from 'fs';
import * as path from 'path';
import { CardPoeDataService } from '../card-poe-data/card-poe-data.service';

@Injectable()
export class PoeDataService {
  constructor(private readonly _cardPoeDataService: CardPoeDataService) {}

  _forceStop: 0 | 1 = 1;
  get forceStop(): 0 | 1 {
    return this._forceStop;
  }

  set forceStop(n: 0 | 1) {
    this._forceStop = n;
  }

  async onModuleInit() {
    const isHaveFile = fs.existsSync(
      path.resolve('data', fileNamesEnum.POE_DATA),
    );
    if (!isHaveFile) {
      await saveAnyJsonInFile(fileNamesEnum.POE_DATA, { cards: [], gems: [] });
    }
  }

  async startUpdate() {
    const fileDataInfo = await fileInfo(fileNamesEnum.POE_DATA);
    const lastUpdate = fileDataInfo.mtime;
    if (Date.now() - lastUpdate.getTime() < 30000) return Promise.resolve();
    while (this._forceStop === 1) {
      try {
        await this._cardPoeDataService.update();
        Logger.log('Passed the cycle');
      } catch (e) {
        this._forceStop = 0;
      }
    }
  }

  async takePoeData() {
    const poeData = await loadAnyFile(fileNamesEnum.POE_DATA);
    const fileDataInfo = await fileInfo(fileNamesEnum.POE_DATA);
    const lastUpdate = fileDataInfo.mtime;
    const canUpdate = Date.now() - lastUpdate.getTime() > 30000;

    return { poeData, lastUpdate, canUpdate };
  }
}
