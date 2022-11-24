import { Test } from '@nestjs/testing';
import * as fs from 'fs';
import { FlipCardsService } from '../flip-cards/flip-cards.service';
import {
  fileExist,
  fileInfo,
  fileNamesEnum,
  loadAnyFile,
  saveAnyJsonInFile,
} from '../tools/workingWithFile';
import { PoeDataService } from './poe-data.service';

jest.mock('../tools/workingWithFile');

describe('PoeDataService', () => {
  let poeDataService: PoeDataService;
  let cardPoeDataService: FlipCardsService;
  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [
        PoeDataService,
        {
          provide: FlipCardsService,
          useValue: {
            update: jest.fn(),
          },
        },
      ], // Add
    }).compile();

    poeDataService = moduleRef.get<PoeDataService>(PoeDataService);
    cardPoeDataService = moduleRef.get<FlipCardsService>(FlipCardsService);
  });

  it('should be defined', () => {
    expect(poeDataService).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should be call function saveAnyJsonInFile', async () => {
      const testCalledWIthObject = {
        cards: [],
        gems: [],
      };
      (fileExist as jest.Mock).mockReturnValue(false);
      (saveAnyJsonInFile as jest.Mock).mockImplementation();
      await poeDataService.onModuleInit();
      expect(saveAnyJsonInFile).toBeCalledTimes(1);
      expect(saveAnyJsonInFile).toBeCalledWith(
        fileNamesEnum.POE_DATA,
        testCalledWIthObject,
      );
    });
    it('should not call function saveAnyJsonInFile', async () => {
      (fileExist as jest.Mock).mockReturnValue(true);
      await poeDataService.onModuleInit();
      expect(saveAnyJsonInFile).toBeCalledTimes(0);
    });
  });

  describe('startUpdate', () => {
    it('should be call  update func in CardPoeDataService', async () => {
      (fileInfo as jest.Mock).mockResolvedValueOnce({
        mtime: new Date(new Date().getTime() - 40000),
      } as fs.Stats);
      jest.spyOn(cardPoeDataService, 'update').mockImplementation(() => {
        poeDataService._forceStop = 0;
        return Promise.resolve();
      });
      await poeDataService.startUpdate();
      expect(cardPoeDataService.update).toHaveBeenCalledTimes(1);
    });

    it('should not call the update function', async () => {
      (fileInfo as jest.Mock).mockResolvedValueOnce({
        mtime: new Date(),
      } as fs.Stats);

      jest.spyOn(cardPoeDataService, 'update');

      await poeDataService.startUpdate();

      expect(cardPoeDataService.update).toHaveBeenCalledTimes(0);
    });

    it('should be call fnc width arg 0 forceStopChanged ', async () => {
      (fileInfo as jest.Mock).mockResolvedValueOnce({
        mtime: new Date(new Date().getTime() - 40000),
      } as fs.Stats);
      jest.spyOn(cardPoeDataService, 'update').mockImplementation(() => {
        throw new Error('test');
      });
      await poeDataService.startUpdate();
      expect(poeDataService._forceStop).toBe(0);
    });
  });

  describe('takePoeData', () => {
    it('should return an object with three keys keys', async () => {
      (fileInfo as jest.Mock).mockResolvedValueOnce({
        mtime: new Date(),
      } as fs.Stats);
      const testObject = await poeDataService.takePoeData();

      const keysThatShouldBe = ['poeData', 'lastUpdate', 'canUpdate'];
      for (const value in testObject) {
        expect(keysThatShouldBe.includes(value)).toBe(true);
      }
    });
    it('should be canUpdate in return object is false', async () => {
      (fileInfo as jest.Mock).mockResolvedValueOnce({
        mtime: new Date(),
      } as fs.Stats);
      const testObject = await poeDataService.takePoeData();
      expect(testObject.canUpdate).toBe(false);
    });
    it('should be lastUpdate equivalent testResultDate', async () => {
      const testResultDate = new Date();
      (fileInfo as jest.Mock).mockResolvedValueOnce({
        mtime: testResultDate,
      } as fs.Stats);
      const testObject = await poeDataService.takePoeData();
      expect(testObject.lastUpdate).toBe(testResultDate);
    });

    it('should be poeData equivalent testResult ', async () => {
      const testResult = { cards: [], gems: [] };
      (fileInfo as jest.Mock).mockResolvedValueOnce({
        mtime: new Date(),
      } as fs.Stats);

      (loadAnyFile as jest.Mock).mockResolvedValueOnce(testResult);

      const testObject = await poeDataService.takePoeData();
      expect(typeof testObject.poeData).toBe('object');
    });
  });
});
