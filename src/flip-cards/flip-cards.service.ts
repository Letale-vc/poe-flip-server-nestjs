import { Injectable, Logger } from '@nestjs/common';
import { PoeFetchService } from '../poe-fetch/poe-fetch.service';
import { delay, round } from '../tools/utils';
import {
  DataItemsType,
  fileNamesEnum,
  loadAnyFile,
  saveAnyJsonInFile,
} from '../tools/workingWithFile';
import {
  PoeSecondResult,
  PoeTradeDataItemsResponse,
} from '../types/response-poe-fetch';
import { CardTypes, ItemInfoType } from './interface/card-types';

@Injectable()
export class FlipCardsService {
  _poeTradeDataItemsLocalFile: PoeTradeDataItemsResponse;
  _divineChaosEquivalent = 0;
  _exaltedChaosEquivalent = 0;
  private readonly logger = new Logger(FlipCardsService.name);

  constructor(private readonly _poeFetchService: PoeFetchService) {}

  async onModuleInit() {
    const items = await this._poeFetchService.poeTradeDataItems();
    this._poeTradeDataItemsLocalFile = items;
    await saveAnyJsonInFile(fileNamesEnum.POE_TRADE_DATA_ITEMS, items);
  }

  async update(forceStop) {
    try {
      const searchQueries = await loadAnyFile(fileNamesEnum.POE_QUERIES_SEARCH);
      if (searchQueries.length === 0)
        return Promise.reject(new Error('Not have queries'));

      const oldRowsPoeData = await loadAnyFile(fileNamesEnum.POE_DATA);

      await delay(20000);
      await this._takeCurrencyEquivalent();
      await searchQueries.reduce(
        async (accPromise: Promise<DataItemsType>, current) => {
          const acc = await accPromise;
          await delay(20000);
          try {
            const row = await this._takeRow({
              ...current,
            });
            let checkIfFindItem = false;
            const newArray = acc.cards.map((el) => {
              if (row.cardInfo.name === el.cardInfo.name) {
                checkIfFindItem = true;
                return row;
              }
              return el;
            });
            if (checkIfFindItem) {
              const newData = {
                ...acc,
                cards: [...newArray],
              };
              await saveAnyJsonInFile(fileNamesEnum.POE_DATA, newData);
              return newData;
            }
            const newData = {
              ...acc,
              cards: [...newArray, row],
            };
            await saveAnyJsonInFile(fileNamesEnum.POE_DATA, newData);

            return newData;
          } catch (err) {
            this.logger.error(err);
            forceStop(0);
            return acc;
          }
        },
        Promise.resolve({ ...oldRowsPoeData }),
      );
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error('UnknownException');
    }
  }

  async _takeCurrencyEquivalent(): Promise<void> {
    this.logger.log('Take currency price');
    const currencyQuery = await loadAnyFile(fileNamesEnum.CURRENCY_QUERIES);
    const divine = await this._poeFetchService.makeARequestToAnyItem(
      currencyQuery.divine,
    );

    this._divineChaosEquivalent =
      divine.result.reduce((acc, value) => {
        return value.listing.price.amount + acc;
      }, 0) / divine.result.length;
    const exalted = await this._poeFetchService.makeARequestToAnyItem(
      currencyQuery.exalted,
    );
    delay(20000);
    this._exaltedChaosEquivalent =
      exalted.result.reduce((acc, value) => {
        return value.listing.price.amount + acc;
      }, 0) / exalted.result.length;
  }

  async _takeRow({
    cardQuery,
    itemQuery,
  }: {
    cardQuery: string;
    itemQuery: string;
  }): Promise<CardTypes> {
    try {
      this.logger.log('First request In Row');
      const cardInfo = await this._takeItemInfo(cardQuery);
      delay(20000);
      this.logger.log('Second request In Row');
      const itemInfo = await this._takeItemInfo(itemQuery);

      const profitInDivine =
        itemInfo.divinePrice - cardInfo.priceInDivineIfFullStackSize;
      const profitInDivinePerCard = profitInDivine / cardInfo.stackSize;
      const profitInChaos = round(
        itemInfo.chaosPrice - cardInfo.priceInChaosIfFullStackSize,
      );
      const profitInChaosPerCard = round(profitInChaos / cardInfo.stackSize);

      return {
        cardInfo,
        itemInfo,
        profitInDivine,
        profitInDivinePerCard,
        profitInChaos,
        profitInChaosPerCard,
      };
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error('UnknownException');
    }
  }

  _takeAnyNameItemInfo(name: string, baseType: string): string {
    if (name !== '') {
      const searchNameIn = this._poeTradeDataItemsLocalFile.result.filter(
        (item) => item.entries.find((entriesName) => entriesName.name === name),
      );
      if (searchNameIn.length !== 0) return name;
      return baseType;
    }
    return baseType;
  }

  async _takeItemInfo(query: string): Promise<ItemInfoType> {
    try {
      const info = await this._poeFetchService.makeARequestToAnyItem(query);
      const { result, id } = info;

      const name = this._takeAnyNameItemInfo(
        result[0].item.name,
        result[0].item.baseType,
      );
      const stackSize = result[0].item.maxStackSize;
      const priceValues = this._takePriceValue(result);
      const priceInChaosIfFullStackSize = stackSize * priceValues.chaosPrice;
      const priceInDivineIfFullStackSize = stackSize * priceValues.divinePrice;

      const poeTradeLinkURL = new URL(
        'https://www.pathofexile.com/trade/search',
      );
      poeTradeLinkURL.pathname = `${poeTradeLinkURL.pathname}/${this._poeFetchService.leagueName}/${id}`;
      return {
        name,
        stackSize,
        ...priceValues,
        priceInChaosIfFullStackSize,
        priceInDivineIfFullStackSize,
        poeTradeLink: poeTradeLinkURL.toString(),
      };
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error('UnknownException');
    }
  }

  // its  calc and take price item
  _takePriceValue(itemsArray: PoeSecondResult[]): {
    divinePrice: number;
    chaosPrice: number;
  } {
    const differenceChaos = 15;
    const differenceDivine = 5;
    // const differenceExalted = 2;
    const resultValue = itemsArray.reduce(
      (
        previousValue,
        currentValue,
        index,
      ): {
        accValue: { chaosPrice: number; divinePrice: number };
        lastPrice: number;
        count: number;
      } => {
        const l = previousValue.count;
        const a = previousValue.accValue;
        const timeInTrade = new Date(currentValue.listing.indexed);
        const dateTimeNow = new Date();
        const timeListed = dateTimeNow.getTime() - timeInTrade.getTime();
        const timeListedChecked = timeListed > 1.44e7;
        const b = currentValue.listing.price.amount;
        // TODO: need uncomment  if need
        // if (previousValue.count >= 4) {
        //   return previousValue;
        // }
        if (l < 3 && timeListedChecked) return previousValue;
        switch (currentValue.listing.price.currency) {
          case 'chaos': {
            const actualPrice = a.chaosPrice / previousValue.count;
            const differenceInPercent = (actualPrice / b) * 100;
            const doesItExistBigDifferencePrice =
              differenceInPercent > differenceChaos;
            if (timeListedChecked && l !== 0 && doesItExistBigDifferencePrice)
              return previousValue;

            const convertChaosInDivine = b / this._divineChaosEquivalent;
            return {
              accValue: {
                chaosPrice: a.chaosPrice + b,
                divinePrice: a.divinePrice + convertChaosInDivine,
              },
              lastPrice: b,
              count: previousValue.count + 1,
            };
          }
          case 'divine': {
            const actualPrice = a.divinePrice / previousValue.count;
            const differenceInPercent = (actualPrice / b) * 100;
            const doesItExistBigDifferencePrice =
              differenceInPercent > differenceDivine;
            if (timeListedChecked && l !== 0 && doesItExistBigDifferencePrice)
              return previousValue;

            const convertDivineInChaos = b * this._divineChaosEquivalent;
            return {
              accValue: {
                chaosPrice: a.chaosPrice + convertDivineInChaos,
                divinePrice: a.divinePrice + b,
              },
              lastPrice: b,
              count: previousValue.count + 1,
            };
          }
          case 'exalted': {
            const convertExaltedInChaos = b * this._exaltedChaosEquivalent;
            const convertExaltedInDivine =
              convertExaltedInChaos / this._divineChaosEquivalent;

            const actualPrice = a.divinePrice / previousValue.count;
            const differenceInPercent =
              (actualPrice / convertExaltedInChaos) * 100;
            const doesItExistBigDifferencePrice =
              differenceInPercent > differenceChaos;

            if (timeListedChecked && l !== 0 && doesItExistBigDifferencePrice)
              return previousValue;

            return {
              accValue: {
                chaosPrice: a.chaosPrice + convertExaltedInChaos,
                divinePrice: a.divinePrice + convertExaltedInDivine,
              },
              lastPrice: b,
              count: previousValue.count + 1,
            };
          }
          default: {
            return previousValue;
          }
        }
      },
      { accValue: { chaosPrice: 0, divinePrice: 0 }, lastPrice: 0, count: 0 },
    );

    //TODO:  remove this and  move to function above
    // if (itemsArray[0].item.baseType === 'Mirror Shard') {
    //   return Math.round((resultValue.accValue / resultValue.count) * 19);
    // }

    return {
      chaosPrice: round(resultValue.accValue.chaosPrice / resultValue.count),
      divinePrice: round(
        resultValue.accValue.divinePrice / resultValue.count,
        2,
      ),
    };
  }
}
