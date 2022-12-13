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
  private logger = new Logger(PoeDataService.name);

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
    const fileDataInfo = await fileInfo(fileNamesEnum.POE_DATA);
    const lastUpdate = fileDataInfo.mtime;
    if (Date.now() - lastUpdate.getTime() < 30000) return Promise.resolve();
    while (this._forceStop === 1) {
      try {
        await this._cardPoeDataService.update(this.forceStop);
        this.logger.log('Passed the cycle');
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
