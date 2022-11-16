import { Injectable, Logger } from '@nestjs/common';
import { fileNamesEnum, saveAnyJsonInFile } from '../tools/workingWithFile';
import * as fs from 'fs';
import * as path from 'path';
import { CardPoeDataService } from '../card-poe-data/card-poe-data.service';

@Injectable()
export class PoeDataService {
  constructor(private readonly _cardPoeDataService: CardPoeDataService) {}

  private _forceStop: 0 | 1 = 1;

  get forceStop(): 0 | 1 {
    return this._forceStop;
  }

  async onModuleInit() {
    const isHaveFile = fs.existsSync(
      path.resolve('data', fileNamesEnum.POE_DATA),
    );
    if (!isHaveFile) {
      await saveAnyJsonInFile(fileNamesEnum.POE_DATA, { cards: [], gems: [] });
    }
  }

  forceStopChanged = (n: 0 | 1) => {
    this._forceStop = n;
  };

  async startUpdate() {
    while (this._forceStop === 1) {
      try {
        await this._cardPoeDataService.update();
        Logger.log('passed the cycle');
      } catch (e) {
        this.forceStopChanged(0);
      }
    }
  }
}
