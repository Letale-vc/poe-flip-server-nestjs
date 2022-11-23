import { Test } from '@nestjs/testing';
import * as fs from 'fs';
import {
  fileNamesEnum,
  loadAnyFile,
  saveAnyJsonInFile,
} from '../tools/workingWithFile';
import { FlipQueriesService } from './flip-queries.service';

jest.mock('../tools/workingWithFile', () => {
  const originalModule = jest.requireActual('../tools/workingWithFile');
  return {
    __esModule: true,
    ...originalModule,
    loadAnyFile: jest.fn(),
    saveAnyJsonInFile: jest.fn(),
  };
});
jest.mock('fs');
describe('FlipQueriesService', () => {
  let queriesService: FlipQueriesService;

  beforeEach(async () => {
    jest.clearAllMocks();
    (loadAnyFile as jest.Mock).mockResolvedValue([]);
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [FlipQueriesService],
    }).compile();

    queriesService = moduleRef.get<FlipQueriesService>(FlipQueriesService);
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
      const uuid = 'testUuid';
      const testUploadedFileQueries = [
        {
          cardQuery: 'test',
          itemQuery: 'test',
          uuid: uuid,
        },
        {
          cardQuery: 'test',
          itemQuery: 'test',
          uuid: '321321321',
        },
      ];
      const newTestFlipQuery = {
        cardQuery: 'test2',
        itemQuery: 'test2',
        uuid: uuid,
      };
      queriesService.uploadedFileQueries = testUploadedFileQueries;
      await queriesService.editQueries(newTestFlipQuery);

      expect(queriesService.uploadedFileQueries).toEqual(
        queriesService.uploadedFileQueries.map((el) => {
          if (el.uuid === uuid) return newTestFlipQuery;
          return el;
        }),
      );
      expect(saveAnyJsonInFile).toBeCalledTimes(1);
      expect(saveAnyJsonInFile).toBeCalledWith(
        fileNamesEnum.POE_QUERIES_SEARCH,
        queriesService.uploadedFileQueries,
      );
    });
  });
  describe('removeQueries', () => {
    it('should be call mock function saveAnyJsonInFile with clear array', async () => {
      const uuid = 'testUuid';
      const testFlipQuery = {
        cardQuery: 'test',
        itemQuery: 'test',
        uuid: uuid,
      };

      queriesService.uploadedFileQueries = [testFlipQuery];
      await queriesService.removeQueries(testFlipQuery);
      expect(saveAnyJsonInFile).toBeCalledTimes(1);
      expect(saveAnyJsonInFile).toBeCalledWith(
        fileNamesEnum.POE_QUERIES_SEARCH,
        [],
      );
    });
  });
  describe('addQuery', () => {
    it('should be call mock function saveAnyJsonInFile with clear array', async () => {
      const uuid = 'testUuid';
      const testFlipQuery = {
        cardQuery: 'test',
        itemQuery: 'test',
        uuid: uuid,
      };
      queriesService.uploadedFileQueries = [];
      await queriesService.addQuery(testFlipQuery);
      expect(saveAnyJsonInFile).toBeCalledTimes(1);
      expect(saveAnyJsonInFile).toBeCalledWith(
        fileNamesEnum.POE_QUERIES_SEARCH,
        [testFlipQuery],
      );
      expect(queriesService.uploadedFileQueries).toEqual([testFlipQuery]);
    });
  });

  describe('onModuleInit', () => {
    it('should be call mock function saveAnyJsonInFile', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      await queriesService.onModuleInit();
      expect(saveAnyJsonInFile).toBeCalledTimes(1);
      expect(saveAnyJsonInFile).toBeCalledWith(
        fileNamesEnum.POE_QUERIES_SEARCH,
        [],
      );
      expect(queriesService.uploadedFileQueries).toEqual([]);
    });
    it('should be call mock function saveAnyJsonInFile', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      await queriesService.onModuleInit();
      expect(saveAnyJsonInFile).toBeCalledTimes(0);
      expect(loadAnyFile).toBeCalledTimes(1);
      expect(loadAnyFile).toBeCalledWith(fileNamesEnum.POE_QUERIES_SEARCH);
      expect(queriesService.uploadedFileQueries).toEqual([]);
    });
  });
});
