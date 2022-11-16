import { Test } from '@nestjs/testing';
import { QueriesService } from './queries.service';
import {
  loadAnyFile,
  saveAnyJsonInFile,
  namesFile,
} from '../tools/workingWithFile';

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
describe('QueriesService', () => {
  let queriesService: QueriesService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [QueriesService], // Add
    }).compile();

    queriesService = moduleRef.get<QueriesService>(QueriesService);
  });

  it('should be defined', () => {
    expect(queriesService).toBeDefined();
  });
  describe('getQueries', () => {
    it('should be return test and toBeCallWith namesFile.poeQueries', async () => {
      // check what the mock function returns loadAnyFile
      expect(await queriesService.getQueries()).toStrictEqual([]);
      expect(loadAnyFile).toBeCalledWith(namesFile.poeQueries);
    });
  });

  describe('editQueries', () => {
    it('should be call mock function saveAnyJsonInFile', async () => {
      await queriesService.editQueries([]);

      expect(saveAnyJsonInFile).toBeCalledTimes(1);
      expect(saveAnyJsonInFile).toBeCalledWith(namesFile.poeQueries, []);
    });
  });
  describe('onModuleInit', () => {
    it('should be call mock function saveAnyJsonInFile', async () => {
      await queriesService.onModuleInit();
      expect(saveAnyJsonInFile).toBeCalledTimes(1);
      expect(saveAnyJsonInFile).toBeCalledWith(namesFile.poeQueries, []);
    });
  });
});
