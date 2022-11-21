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
            removeQueries: jest.fn(),
            addQuery: jest.fn(),
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
      const testBodyValues = {
        cardQuery: 'test',
        itemQuery: 'test',
        uuid: 'test',
      };

      await queriesController.update(testBodyValues);

      expect(queriesService.editQueries).toBeCalledTimes(1);
      expect(queriesService.editQueries).toBeCalledWith(testBodyValues);
    });
    describe('delete', () => {
      it('should be call  one time function queriesService.removeQueries', async () => {
        const testBodyValues = {
          cardQuery: 'test',
          itemQuery: 'test',
          uuid: 'test',
        };

        await queriesController.delete(testBodyValues);
        expect(queriesService.removeQueries).toBeCalledTimes(1);
        expect(queriesService.removeQueries).toBeCalledWith(testBodyValues);
      });
    });
    describe('update', () => {
      it('should be call  one time function queriesService.removeQueries', async () => {
        const testBodyValues = {
          cardQuery: 'test',
          itemQuery: 'test',
          uuid: 'test',
        };

        await queriesController.update(testBodyValues);
        expect(queriesService.editQueries).toBeCalledTimes(1);
        expect(queriesService.editQueries).toBeCalledWith(testBodyValues);
      });
    });
    describe('add', () => {
      it('should be call  one time function queriesService.removeQueries', async () => {
        const testBodyValues = {
          cardQuery: 'test',
          itemQuery: 'test',
          uuid: 'test',
        };

        await queriesController.add(testBodyValues);
        expect(queriesService.addQuery).toBeCalledTimes(1);
        expect(queriesService.addQuery).toBeCalledWith(testBodyValues);
      });
    });
  });
});
