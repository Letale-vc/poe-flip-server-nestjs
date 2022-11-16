import * as path from 'path';
import * as fs from 'fs/promises';
import { RowType } from '../card-poe-data/cardPoeTypes';
import { PoeTradeDataItemsResponse } from '../types/responsePoeFetch';
import { QueriesItems } from '../queries/interface/queries.interface';

export enum fileNamesEnum {
  POE_QUERIES_SEARCH = 'poeSearchUrls.json',
  POE_DATA = 'poeData.json',
  POE_TRADE_DATA_ITEMS = 'poeTradeDataItems.json',
  CURRENCY_QUERIES = 'currencyQuery.json',
}

export type CurrencyQueriesType = { divine: string; exalted: string };
export type QueriesItemsFileType = QueriesItems[];
export type DataItemsType = {
  cards: Array<RowType>;
  gems: Array<Object>;
};
export type loadAnyFileType = <S extends fileNamesEnum>(
  nameFile: S,
) => Promise<GetReturnFileType<S>>;

export type GetReturnFileType<T> = T extends fileNamesEnum.CURRENCY_QUERIES
  ? CurrencyQueriesType
  : T extends fileNamesEnum.POE_TRADE_DATA_ITEMS
  ? PoeTradeDataItemsResponse
  : T extends fileNamesEnum.POE_DATA
  ? DataItemsType
  : T extends fileNamesEnum.POE_QUERIES_SEARCH
  ? QueriesItemsFileType
  : unknown;

export const loadAnyFile: loadAnyFileType = async (nameFile) => {
  const pathFile = path.resolve('data', nameFile);
  const contents = await fs.readFile(pathFile);
  return JSON.parse(contents.toString());
};

export type SaveAnyJsonInFileType = <
  S extends fileNamesEnum,
  T extends GetReturnFileType<S>,
>(
  nameFile: S,
  data: T,
) => Promise<void>;

export const saveAnyJsonInFile: SaveAnyJsonInFileType = async (
  nameFile,
  data,
) => {
  const pathPoeDataFile = path.resolve('data', nameFile);
  const stringifyPoeData = JSON.stringify(data, null, 4);
  return fs.writeFile(pathPoeDataFile, stringifyPoeData);
};
