import { Test } from '@nestjs/testing';
import { PoeQueriesService } from './poe-queries.service';
import {
  fileNamesEnum,
  loadAnyFile,
  saveAnyJsonInFile,
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
  let queriesService: PoeQueriesService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [PoeQueriesService], // Add
    }).compile();

    queriesService = moduleRef.get<PoeQueriesService>(PoeQueriesService);
  });

  it('should be defined', () => {
    expect(queriesService).toBeDefined();
  });
  describe('getQueries', () => {
    it('should be return test and toBeCallWith fileNamesEnum.POE_QUERIES_SEARCH', async () => {
      // check what the mock function returns loadAnyFile
      expect(await queriesService.getQueries()).toStrictEqual([]);
      expect(loadAnyFile).toBeCalledWith(fileNamesEnum.POE_QUERIES_SEARCH);
    });
  });

  describe('editQueries', () => {
    it('should be call mock function saveAnyJsonInFile', async () => {
      await queriesService.editQueries([]);

      expect(saveAnyJsonInFile).toBeCalledTimes(1);
      expect(saveAnyJsonInFile).toBeCalledWith(
        fileNamesEnum.POE_QUERIES_SEARCH,
        [],
      );
    });
  });
  describe('onModuleInit', () => {
    it('should be call mock function saveAnyJsonInFile', async () => {
      await queriesService.onModuleInit();
      expect(saveAnyJsonInFile).toBeCalledTimes(1);
      expect(saveAnyJsonInFile).toBeCalledWith(
        fileNamesEnum.POE_QUERIES_SEARCH,
        [],
      );
    });
  });
});
