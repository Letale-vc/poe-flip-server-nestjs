import { Test } from '@nestjs/testing';
import { CardPoeDataService } from './card-poe-data.service';
import * as filesWork from '../tools/workingWithFile';
import { fileNamesEnum, saveAnyJsonInFile } from '../tools/workingWithFile';
import { PoeFetchService } from '../poe-fetch/poe-fetch.service';
import { PoeSecondResult } from '../types/response-poe-fetch';
import { testPoeSecondResponse } from '../../mocks/testPoeSecondResponse';

jest.mock('../tools/workingWithFile', () => {
  const originalModule = jest.requireActual('../tools/workingWithFile');
  return {
    __esModule: true,
    ...originalModule,
    saveAnyJsonInFile: jest.fn(),
  };
});
jest.mock('../tools/utils', () => {
  const originalModule = jest.requireActual('../tools/utils');
  return {
    __esModule: true,
    ...originalModule,
    delay: jest.fn(),
  };
});

describe('CardPoeDataService', () => {
  let service: CardPoeDataService;
  let poeFetchService: PoeFetchService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        CardPoeDataService,
        {
          provide: PoeFetchService,
          useValue: {
            leagueName: 'testLeagueName',
            onModuleInit: jest.fn(),
            _takeLeagueName: jest.fn(),
            poeTradeDataItems: jest.fn(),
            poeFirsRequest: jest.fn(),
            poeSecondRequest: jest.fn(),
            makeARequestToAnyItem: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CardPoeDataService>(CardPoeDataService);
    poeFetchService = module.get<PoeFetchService>(PoeFetchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should be called _poeFetchService.poeTradeDataItems and saveAnyJsonInFile ', async () => {
      await service.onModuleInit();
      expect(saveAnyJsonInFile).toBeCalledTimes(1);
      expect(poeFetchService.poeTradeDataItems).toBeCalledTimes(1);
    });
  });

  describe('_takeCurrencyEquivalent', () => {
    it('_divineChaosEquivalent and _exaltedChaosEquivalent should to be exact equal test values', async () => {
      const testValueEqual = 33;
      const mockReturnMakeARequestToAnyItemValue = {
        result: [
          { listing: { price: { amount: testValueEqual } } },
        ] as PoeSecondResult[],
        id: 'test',
      };
      jest
        .spyOn(poeFetchService, 'makeARequestToAnyItem')
        .mockResolvedValue(mockReturnMakeARequestToAnyItemValue);
      await service._takeCurrencyEquivalent();
      expect(poeFetchService.makeARequestToAnyItem).toHaveBeenCalledTimes(2);
      expect(service._exaltedChaosEquivalent).toBe(testValueEqual);
      expect(service._divineChaosEquivalent).toBe(testValueEqual);
    });
  });

  describe('_takeAnyNameItemInfo', () => {
    it('must find name in _poeTradeDataItemsLocalFile and return this name', () => {
      const name = 'testName';
      const typeBase = 'testTypeBase';
      service._poeTradeDataItemsLocalFile = {
        result: [
          {
            id: 'test',
            label: 'test lavel',
            entries: [
              {
                name: name,
                type: "Niko's Memory",
                text: "Niko's Memory",
              },
            ],
          },
        ],
      };
      expect(service._takeAnyNameItemInfo(name, typeBase)).toBe(name);
    });

    it('should take an empty name, and return typeBase', () => {
      const name = '';
      const typeBase = 'testTypeBase';
      service._poeTradeDataItemsLocalFile = {
        result: [
          {
            id: 'test',
            label: 'test label',
            entries: [
              {
                name: name,
                type: "Niko's Memory",
                text: "Niko's Memory",
              },
            ],
          },
        ],
      };

      expect(service._takeAnyNameItemInfo(name, typeBase)).toBe(typeBase);
    });
    it('should take not empty name, not find in _poeTradeDataItemsLocalFile name and return typeBase', () => {
      const name = 'testName';
      const typeBase = 'testTypeBase';
      service._poeTradeDataItemsLocalFile = {
        result: [
          {
            id: 'test',
            label: 'test label',
            entries: [
              {
                name: name,
                type: "Niko's Memory",
                text: "Niko's Memory",
              },
            ],
          },
        ],
      };

      expect(service._takeAnyNameItemInfo('TEST', typeBase)).toBe(typeBase);
    });
  });

  describe('_takePriceValue', () => {
    beforeEach(() => {
      service._divineChaosEquivalent = 10;
      service._exaltedChaosEquivalent = 5;
    });

    it('should return the result, itemsArray no difference in values', () => {
      const testAmountDivineValue = 2;
      const testAmountChaosValue = 150;
      const testAmountExaltedValue = 20;
      const testItemsArray = [
        {
          listing: {
            price: {
              amount: testAmountDivineValue,
              currency: 'divine',
            },
          },
        },
        {
          listing: {
            price: {
              amount: testAmountChaosValue,
              currency: 'chaos',
            },
          },
        },
        {
          listing: {
            price: {
              amount: testAmountExaltedValue,
              currency: 'exalted',
            },
          },
        },
        {
          listing: {
            price: {
              amount: 211,
              currency: 'alteration',
            },
          },
        },
      ] as unknown as PoeSecondResult[];
      const chaosPrice =
        (testAmountChaosValue +
          testAmountDivineValue * service._divineChaosEquivalent +
          testAmountExaltedValue * service._exaltedChaosEquivalent) /
        3;
      const divinePrice =
        (2 +
          testAmountChaosValue / service._divineChaosEquivalent +
          (testAmountExaltedValue * service._exaltedChaosEquivalent) /
            service._divineChaosEquivalent) /
        3;
      const returnValues = {
        chaosPrice: chaosPrice,
        divinePrice: divinePrice,
      };
      const result = service._takePriceValue(testItemsArray);
      expect(result).toEqual(returnValues);
    });
  });

  describe('_takeItemInfo', () => {
    it('should return an object with keys like in expectKeysInObject', async () => {
      jest.spyOn(poeFetchService, 'makeARequestToAnyItem').mockResolvedValue({
        result: testPoeSecondResponse.card
          .result as unknown as Array<PoeSecondResult>,
        id: 'test',
      });
      const expectKeysInObject = [
        'name',
        'stackSize',
        'chaosPrice',
        'divinePrice',
        'priceInChaosIfFullStackSize',
        'priceInDivineIfFullStackSize',
        'poeTradeLink',
      ];
      const testedObject = await service._takeItemInfo('test');
      const keys = Object.keys(testedObject);

      expectKeysInObject.forEach((key) => {
        expect(keys.find((el) => el === key)).toBe(key);
      });
    });
  });

  describe('_takeRow', () => {
    it('should return an object with keys like in expectKeysInObject', async () => {
      const mockInfoObject = {
        name: 'test',
        stackSize: 1,
        chaosPrice: 1,
        divinePrice: 1,
        priceInChaosIfFullStackSize: 1,
        priceInDivineIfFullStackSize: 1,
        poeTradeLink: 'test',
      };
      jest.spyOn(service, '_takeItemInfo').mockResolvedValue(mockInfoObject);

      const expectKeysInObject = [
        'cardInfo',
        'itemInfo',
        'profitInDivine',
        'profitInDivinePerCard',
        'profitInChaos',
        'profitInChaosPerCard',
      ];
      const testedObject = await service._takeRow({
        cardQuery: 'test',
        itemQuery: 'test',
      });
      const keys = Object.keys(testedObject);
      expectKeysInObject.forEach((key) => {
        expect(keys.find((el) => el === key)).toBe(key);
      });
    });
  });

  describe('update', () => {
    it('should be called function _takeCurrencyEquivalent', async () => {
      jest.spyOn(service, '_takeCurrencyEquivalent').mockResolvedValue();
      jest.spyOn(filesWork, 'loadAnyFile').mockImplementation((arg) => {
        if (arg === fileNamesEnum.POE_DATA) {
          return Promise.resolve({ cards: [], gems: [] });
        }
        return Promise.resolve([]);
      });

      await service.update();
      expect(service._takeCurrencyEquivalent).toHaveBeenCalledTimes(1);
    });
    it('should call saveAnyJsonInFile function with test attributes, if not have row in data file', async () => {
      jest.spyOn(service, '_takeCurrencyEquivalent').mockResolvedValue();
      const mockInfoObject = {
        name: 'test',
        stackSize: 1,
        chaosPrice: 1,
        divinePrice: 1,
        priceInChaosIfFullStackSize: 1,
        priceInDivineIfFullStackSize: 1,
        poeTradeLink: 'test',
      };
      const mockRowObject = {
        cardInfo: mockInfoObject,
        itemInfo: mockInfoObject,
        profitInDivine: 1,
        profitInDivinePerCard: 2,
        profitInChaos: 3,
        profitInChaosPerCard: 4,
      };
      jest.spyOn(service, '_takeRow').mockResolvedValue(mockRowObject);
      jest.spyOn(filesWork, 'loadAnyFile').mockImplementation((arg) => {
        if (arg === fileNamesEnum.POE_DATA) {
          return Promise.resolve({ cards: [], gems: [] });
        }
        return Promise.resolve([{ cardQuery: 'test', itemQuery: 'test' }]);
      });
      await service.update();
      expect(saveAnyJsonInFile).toHaveBeenCalledTimes(1);
      expect(saveAnyJsonInFile).toHaveBeenCalledWith(fileNamesEnum.POE_DATA, {
        cards: [mockRowObject],
        gems: [],
      });
    });
    it('should call saveAnyJsonInFile function with test attributes, if have row in data file', async () => {
      jest.spyOn(service, '_takeCurrencyEquivalent').mockResolvedValue();
      const mockInfoObject = {
        name: 'test',
        stackSize: 1,
        chaosPrice: 1,
        divinePrice: 1,
        priceInChaosIfFullStackSize: 1,
        priceInDivineIfFullStackSize: 1,
        poeTradeLink: 'test',
      };
      const mockRowObject = {
        cardInfo: mockInfoObject,
        itemInfo: mockInfoObject,
        profitInDivine: 1,
        profitInDivinePerCard: 2,
        profitInChaos: 3,
        profitInChaosPerCard: 4,
      };
      const mockRowObject2 = {
        ...mockRowObject,
        cardInfo: { ...mockRowObject.cardInfo, name: 'test2' },
      };
      const result = {
        cards: [mockRowObject, mockRowObject2],
        gems: [],
      };
      jest.spyOn(service, '_takeRow').mockResolvedValue(mockRowObject2);
      jest.spyOn(filesWork, 'loadAnyFile').mockImplementation((arg) => {
        if (arg === fileNamesEnum.POE_DATA) {
          return Promise.resolve({
            cards: [mockRowObject, mockRowObject2],
            gems: [],
          });
        }
        return Promise.resolve([{ cardQuery: 'test', itemQuery: 'test' }]);
      });
      await service.update();
      expect(saveAnyJsonInFile).toHaveBeenCalledTimes(1);
      expect(saveAnyJsonInFile).toHaveBeenCalledWith(
        fileNamesEnum.POE_DATA,
        result,
      );
    });
  });
});
