import { Injectable, Logger } from '@nestjs/common';
import { FlipCardsService } from '../flip-cards/flip-cards.service';
import {
  fileExist,
  fileInfo,
  fileNamesEnum,
  loadAnyFile,
  saveAnyJsonInFile,
} from '../tools/workingWithFile';

@Injectable()
export class PoeDataService {
  _forceStop: 0 | 1 = 1;

  private updateNow = false;

  constructor(private readonly _cardPoeDataService: FlipCardsService) {}

  forceStop(n: 0 | 1) {
    this._forceStop = n;
  }

  async onModuleInit() {
    const isHaveFile = fileExist(fileNamesEnum.POE_DATA);
    if (!isHaveFile) {
      await saveAnyJsonInFile(fileNamesEnum.POE_DATA, { cards: [], gems: [] });
    }
  }

  async startUpdate() {
    if (this.updateNow) return Promise.resolve();
    while (this._forceStop === 1) {
      try {
        this.updateNow = true;
        await this._cardPoeDataService.update(this.forceStop);
        Logger.log('Passed the cycle');
      } catch (e) {
        this.updateNow = false;
        this._forceStop = 0;
      }
    }
  }

  async takePoeData() {
    const poeData = await loadAnyFile(fileNamesEnum.POE_DATA);
    const fileDataInfo = await fileInfo(fileNamesEnum.POE_DATA);
    const lastUpdate = fileDataInfo.mtime;
    const canUpdate = !!this.updateNow;

    return { poeData, lastUpdate, canUpdate };
  }
}
