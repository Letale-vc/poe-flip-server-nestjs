import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { QueriesController } from './queries.controller';
import { QueriesService } from './queries.service';
import * as httpMock from 'node-mocks-http';

describe('QueriesController', () => {
  let queriesController: QueriesController;
  let queriesService: QueriesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [QueriesController], // Add
      providers: [
        {
          provide: QueriesService,
          useValue: {
            getQueries: jest.fn().mockResolvedValueOnce([]),
            editQueries: jest.fn(),
          },
        },
      ], // Add
    }).compile();

    queriesController = moduleRef.get<QueriesController>(QueriesController);
    queriesService = moduleRef.get<QueriesService>(QueriesService);
  });

  it('should be defined', () => {
    expect(queriesController).toBeDefined();
  });

  describe('getAll', () => {
    it('should be return clear array', async () => {
      expect(await queriesController.getAll()).toStrictEqual([]);
    });
  });

  describe('update', () => {
    it('should be call  one time function queriesService.editQueries', async () => {
      const testBodyValues = [{ cardQuery: 'test', itemQuery: 'test' }];
      await queriesController.update(testBodyValues);

      expect(queriesService.editQueries).toBeCalledTimes(1);
      expect(queriesService.editQueries).toBeCalledWith(testBodyValues);
    });
  });
});
