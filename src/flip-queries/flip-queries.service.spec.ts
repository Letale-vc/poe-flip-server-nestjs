import { Test } from '@nestjs/testing';
import * as fs from 'fs';
import * as uuid from 'uuid';
import {
  fileNamesEnum,
  loadAnyFile,
  saveAnyJsonInFile,
} from '../tools/workingWithFile';
import { FlipQueriesService } from './flip-queries.service';

jest.mock('uuid');
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
      (loadAnyFile as jest.Mock).mockResolvedValue([]);
      expect(await queriesService.getQueries()).toStrictEqual([]);
      expect(loadAnyFile).toBeCalledWith(fileNamesEnum.POE_QUERIES_SEARCH);
    });
  });

  describe('editQueries', () => {
    it('should be call mock function saveAnyJsonInFile', async () => {
      const testUuid = 'testUuid';
      const testUploadedFileQueries = [
        {
          cardQuery: 'test',
          itemQuery: 'test',
          uuid: testUuid,
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
        uuid: testUuid,
      };
      (loadAnyFile as jest.Mock).mockResolvedValue(testUploadedFileQueries);
      await queriesService.editQueries(newTestFlipQuery);

      expect(saveAnyJsonInFile).toBeCalledTimes(1);
      expect(saveAnyJsonInFile).toBeCalledWith(
        fileNamesEnum.POE_QUERIES_SEARCH,
        testUploadedFileQueries.map((el) =>
          el.uuid === testUuid ? newTestFlipQuery : el,
        ),
      );
    });
  });
  describe('removeQueries', () => {
    it('should be call mock function saveAnyJsonInFile with clear array', async () => {
      const testUuid = 'testUuid';
      const testFlipQuery = {
        cardQuery: 'test',
        itemQuery: 'test',
        uuid: testUuid,
      };
      (loadAnyFile as jest.Mock).mockResolvedValue([testFlipQuery]);
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
      const testOldFlipQueries = [
        {
          cardQuery: 'testOldString',
          itemQuery: 'testOldString',
          uuid: 'uuid',
        },
      ];
      (loadAnyFile as jest.Mock).mockResolvedValue(testOldFlipQueries);
      const testUuid = 'testUuid';
      const testFlipQuery = {
        cardQuery: 'test',
        itemQuery: 'test',
      };
      jest.spyOn(uuid, 'v1').mockReturnValue(testUuid);

      await queriesService.addQuery(testFlipQuery);
      expect(saveAnyJsonInFile).toBeCalledTimes(1);

      expect(saveAnyJsonInFile).toHaveBeenCalledWith(
        fileNamesEnum.POE_QUERIES_SEARCH,
        [...testOldFlipQueries, { ...testFlipQuery, uuid: testUuid }],
      );
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
    });
    it('should be call mock function saveAnyJsonInFile', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      await queriesService.onModuleInit();
      expect(saveAnyJsonInFile).toBeCalledTimes(0);
    });
  });
});
