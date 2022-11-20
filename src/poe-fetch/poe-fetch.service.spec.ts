import { Test } from '@nestjs/testing';
import { PoeFetchService } from './poe-fetch.service';
import { HttpModule } from '@nestjs/axios';
import poeHandlers, { poeFirstResponse, queryId } from '../../mocks/handlers';
import { setupServer } from 'msw/node';
import * as fs from 'fs/promises';
import { testPoeSecondResponse } from '../../mocks/testPoeSecondResponse';
import { testPoeTradeDataItems } from '../../mocks/testPoeTradeDataItems';

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
    ...originalModule,
    existsSync: jest.fn().mockReturnValueOnce(false),
  };
});
const server = setupServer(...poeHandlers);
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  });
});
afterAll(() => {
  server.close();
});

describe('PoeFetchService', () => {
  let poeFetchService: PoeFetchService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      exports: [PoeFetchService],
      imports: [HttpModule],
      controllers: [],
      providers: [PoeFetchService],
    }).compile();

    poeFetchService = moduleRef.get<PoeFetchService>(PoeFetchService);
  });

  it('should be defined', () => {
    expect(poeFetchService).toBeDefined();
  });
  describe('_takeLeagueName', () => {
    it('should be return string name: Kalandra', async () => {
      const leagueName = await poeFetchService._takeLeagueName();
      expect(leagueName).toBe('Kalandra');
    });
  });

  describe('poeTradeDataItems', () => {
    it('should be return testArray', async () => {
      const data = await poeFetchService.poeTradeDataItems();
      expect(data).toEqual(testPoeTradeDataItems);
    });
  });
  describe('onModuleInit', () => {
    it('leagueName  should be equal = Klanadra', async () => {
      await poeFetchService.onModuleInit();
      expect(poeFetchService.leagueName).toBe('Kalandra');
    });
  });

  describe('poeFirsRequest', () => {
    it('should be return objectFirstRequest ', async () => {
      expect(await poeFetchService.poeFirsRequest(queryId.card)).toEqual(
        poeFirstResponse.card,
      );
    });
  });
  describe('poeSecondRequest', () => {
    it('should be return poeSecondResponse ', async () => {
      expect(
        await poeFetchService.poeSecondRequest(
          poeFirstResponse.card.result,
          poeFirstResponse.card.id,
        ),
      ).toEqual(testPoeSecondResponse.card);
    });
  });

  describe('makeARequestToAnyItem', () => {
    it('should be return testObject', async () => {
      const testObject = {
        result: testPoeSecondResponse.card.result,
        id: poeFirstResponse.card.id,
      };
      const testFetchResult = await poeFetchService.makeARequestToAnyItem(
        queryId.card,
      );

      expect(testFetchResult).toEqual(testObject);
    });
  });
});
