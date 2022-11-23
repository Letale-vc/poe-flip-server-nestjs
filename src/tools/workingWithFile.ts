import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { CardTypes } from '../card-poe-data/interface/card-types';
import { QueriesItems } from '../flip-queries/interface/queries.interface';
import { PoeTradeDataItemsResponse } from '../types/response-poe-fetch';

export enum fileNamesEnum {
  POE_QUERIES_SEARCH = 'poeSearchUrls.json',
  POE_DATA = 'poeData.json',
  POE_TRADE_DATA_ITEMS = 'poeTradeDataItems.json',
  CURRENCY_QUERIES = 'currencyQuery.json',
}

const pathFolder = path.resolve('data');
const createPathFolderFile = (nameFile: fileNamesEnum) =>
  path.join(pathFolder, nameFile);

export type CurrencyQueriesType = { divine: string; exalted: string };
export type QueriesItemsFileType = Array<QueriesItems>;

export interface DataItemsType {
  cards: Array<CardTypes>;
  gems: Array<Object>;
}

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
  const pathFile = createPathFolderFile(nameFile);
  const contents = await fsPromises.readFile(pathFile);
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
  const pathFile = createPathFolderFile(nameFile);
  const stringifyPoeData = JSON.stringify(data, null, 4);
  return fsPromises.writeFile(pathFile, stringifyPoeData);
};

export const fileInfo = async (nameFile: fileNamesEnum) => {
  const pathFile = createPathFolderFile(nameFile);
  return fsPromises.stat(pathFile);
};
export const fileExist = (nameFile: fileNamesEnum) => {
  const pathFile = createPathFolderFile(nameFile);
  return fs.existsSync(pathFile);
};

export default {
  saveAnyJsonInFile,
  fileInfo,
  loadAnyFile,
  fileExist,
};
