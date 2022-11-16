import { Injectable, Logger } from '@nestjs/common';
import {
  namesFile,
  loadAnyFile,
  saveAnyJsonInFile,
} from '../tools/workingWithFile';
import { PoeFetchService } from '../poe-fetch/poe-fetch.service';
import { delay, round } from '../tools/utils';
import { ItemInfoType, RowType } from './cardPoeTypes';
import {
  PoeTradeDataItemsResponse,
  PoeSecondResult,
} from '../types/responsePoeFetch';

@Injectable()
export class CardPoeDataService {
  constructor(private readonly _poeFetchService: PoeFetchService) {}

  private _poeTradeDataItemsLocalFile: PoeTradeDataItemsResponse;
  public set poeTradeDataItemsLocalFile(value: PoeTradeDataItemsResponse) {
    this._poeTradeDataItemsLocalFile = value;
  }
  _divineChaosEquivalent = 0;
  _exaltedChaosEquivalent = 0;

  async onModuleInit() {
    const items = await this._poeFetchService.poeTradeDataItems();
    this._poeTradeDataItemsLocalFile = items;
    await saveAnyJsonInFile(namesFile.poeTradeDataItems, items);
  }

  async update(): Promise<void> {
    try {
      await this._takeCurrencyEquivalent();
      const searchQueries = await loadAnyFile(namesFile.poeQueries); //?

      const oldRowPoeData = await loadAnyFile(namesFile.poeData); //?

      await searchQueries.reduce(async (accPromise, current) => {
        const acc = await accPromise;
        await delay();
        try {
          const row = await this._takeRow({
            ...current,
          });
          let checkIfFindItem = false;
          const newArray = acc.card.map((el) => {
            if (row.cardInfo.name === el.cardInfo.name) {
              checkIfFindItem = true;
              return row;
            }
            return el;
          });
          if (checkIfFindItem) {
            const newData = {
              ...acc,
              card: newArray,
            };
            await saveAnyJsonInFile(namesFile.poeData, newData);
            return newData;
          }
          const newData = {
            ...acc,
            card: [...newArray, row],
          };
          await saveAnyJsonInFile(namesFile.poeData, newData);
          return newData;
        } catch (err) {
          Logger.error(err);
          return acc;
        }
      }, Promise.resolve({ ...oldRowPoeData }));
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error('UnknownException');
    }
  }

  async _takeCurrencyEquivalent(): Promise<void> {
    const currencyQuery: { divine: string; exalted: string } =
      await loadAnyFile(namesFile.currencyQuery);
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
  }): Promise<RowType> {
    try {
      const cardInfo = await this._takeItemInfo(cardQuery);
      const itemInfo = await this._takeItemInfo(itemQuery);

      const profitInDivine =
        itemInfo.divinePrice - cardInfo.priceInDivineIfFullStackSize;

      const profitInDivinePerCard = round(
        profitInDivine / cardInfo.stackSize,
        2,
      );

      const profitInChaos =
        itemInfo.chaosPrice - cardInfo.priceInDivineIfFullStackSize;

      const profitInChaosPerCard = Math.round(
        profitInChaos / cardInfo.stackSize,
      );

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
      const priceInChaosIfFullStackSize =
        result[0].item.maxStackSize * priceValues.chaosPrice;
      const priceInDivineIfFullStackSize =
        result[0].item.maxStackSize * priceValues.divinePrice;
      const poeTradeLink = `https://www.pathofexile.com/api/trade/search/${this._poeFetchService.leagueName}/${id}`;

      return {
        name,
        stackSize,
        ...priceValues,
        priceInChaosIfFullStackSize,
        priceInDivineIfFullStackSize,
        poeTradeLink,
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
    const differenceDivine = 1;
    const differenceExalted = 2;
    const resultValue = itemsArray.reduce(
      (
        previousValue,
        currentValue,
      ): {
        accValue: { chaosPrice: number; divinePrice: number };
        lastPrice: number;
        count: number;
      } => {
        const l = previousValue.lastPrice;
        const a = previousValue.accValue;
        const b = currentValue.listing.price.amount;
        // TODO: need uncomment  if need
        // if (previousValue.count >= 4) {
        //   return previousValue;
        // }
        // if (l !== 0 && (l / b) * 100 < 80) {
        //   return {
        //     accValue: { chaosPrice: 0, divinePrice: 0 },
        //     lastPrice: 0,
        //     count: 0,
        //   };
        // }
        switch (currentValue.listing.price.currency) {
          case 'chaos': {
            // if (
            //   l !== 0 &&
            //   b - previousValue.accValue.chaosPrice / previousValue.count >
            //     differenceChaos
            // ) {
            //   return previousValue;
            // }
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
            // if (l !== 0 && b - l > differenceDivine) {
            //   return previousValue;
            // }
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
            // if (l !== 0 && b - l > differenceExalted) {
            //   return previousValue;
            // }
            const convertExaltedInChaos = b * this._exaltedChaosEquivalent;
            const convertExaltedInDivine =
              convertExaltedInChaos / this._divineChaosEquivalent;
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
      chaosPrice: Math.round(
        resultValue.accValue.chaosPrice / resultValue.count,
      ),
      divinePrice: resultValue.accValue.divinePrice / resultValue.count,
    };
  }
}
