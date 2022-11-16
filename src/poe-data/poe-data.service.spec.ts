import { Test } from '@nestjs/testing';
import { PoeDataService } from './poe-data.service';
import { fileNamesEnum, saveAnyJsonInFile } from '../tools/workingWithFile';

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

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [PoeDataService], // Add
    }).compile();

    poeDataService = moduleRef.get<PoeDataService>(PoeDataService);
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
});
