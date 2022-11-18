import { Test } from '@nestjs/testing';
import { PoeQueriesController } from './poe-queries-controller';
import { PoeQueriesService } from './poe-queries.service';

describe('QueriesController', () => {
  let queriesController: PoeQueriesController;
  let queriesService: PoeQueriesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [PoeQueriesController], // Add
      providers: [
        {
          provide: PoeQueriesService,
          useValue: {
            getQueries: jest.fn().mockResolvedValueOnce([]),
            editQueries: jest.fn(),
          },
        },
      ], // Add
    }).compile();

    queriesController =
      moduleRef.get<PoeQueriesController>(PoeQueriesController);
    queriesService = moduleRef.get<PoeQueriesService>(PoeQueriesService);
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
