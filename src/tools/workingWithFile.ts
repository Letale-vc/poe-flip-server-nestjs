import * as path from 'path';
import * as fs from 'fs/promises';

export const namesFile = {
  poeQueries: 'poeSearchUrls.json',
  poeData: 'poeData.json',
  poeTradeDataItems: 'poeTradeDataItems.json',
  currencyQuery: 'currencyQuery.json',
};

export const loadAnyFile = async (
  nameFile: string,
): Promise<unknown | false> => {
  const pathFile = path.resolve(nameFile);
  const contents = await fs.readFile(pathFile);
  return JSON.parse(contents.toString());
};

export const saveAnyJsonInFile = async (
  nameFile: string,
  data: Array<{ [key: string]: unknown }> | { [key: string]: unknown },
) => {
  const pathPoeDataFile = path.resolve(nameFile);
  const stringifyPoeData = JSON.stringify(data, null, 4);
  return fs.writeFile(pathPoeDataFile, stringifyPoeData);
};
