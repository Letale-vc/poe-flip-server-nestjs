import { Test } from '@nestjs/testing';
import { PoeDataService } from './poe-data.service';
import { fileNamesEnum, saveAnyJsonInFile } from '../tools/workingWithFile';
import { CardPoeDataService } from '../card-poe-data/card-poe-data.service';

jest.mock('../tools/workingWithFile', () => {
  const originalModule = jest.requireActual('../tools/workingWithFile');
  return {
    __esModule: true,
    ...originalModule,
    loadAnyFile: jest.fn().mockResolvedValueOnce([]),
    saveAnyJsonInFile: jest.fn(),
  };
});

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs');
  return {
    __esModule: true,
    ...originalModule,
    existsSync: jest.fn().mockReturnValueOnce(false),
  };
});
describe('PoeDataService', () => {
  let poeDataService: PoeDataService;
  let cardPoeDataService: CardPoeDataService;
  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [
        PoeDataService,
        {
          provide: CardPoeDataService,
          useValue: {
            update: jest.fn(),
          },
        },
      ], // Add
    }).compile();

    poeDataService = moduleRef.get<PoeDataService>(PoeDataService);
    cardPoeDataService = moduleRef.get<CardPoeDataService>(CardPoeDataService);
  });

  it('should be defined', () => {
    expect(poeDataService).toBeDefined();
  });
  describe('onModuleInit', () => {
    it('should be call mock function saveAnyJsonInFile', async () => {
      await poeDataService.onModuleInit();
      expect(saveAnyJsonInFile).toBeCalledTimes(1);
      expect(saveAnyJsonInFile).toBeCalledWith(fileNamesEnum.POE_DATA, {
        cards: [],
        gems: [],
      });
    });
  });

  describe('startUpdate', () => {
    it('should be call  update func in CardPoeDataService', () => {
      poeDataService.startUpdate();
      poeDataService.forceStopChanged(0);
      expect(cardPoeDataService.update).toHaveBeenCalledTimes(1);
    });

    it('should be call fnc width arg 0 forceStopChanged ', () => {
      jest.spyOn(cardPoeDataService, 'update').mockImplementation(() => {
        throw new Error('test');
      });
      jest.spyOn(poeDataService, 'forceStopChanged');
      poeDataService.startUpdate();
      expect(poeDataService.forceStopChanged).toHaveBeenCalledTimes(1);
      expect(poeDataService.forceStopChanged).toHaveBeenCalledWith(0);
    });
  });
});
