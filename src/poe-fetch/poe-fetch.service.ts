import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  PoeFirstResponse,
  PoeSecondResponse,
  PoeSecondResult,
  PoeTradeDataItemsResponse,
  ResponseLeagueList,
} from '../types/response-poe-fetch';

@Injectable()
export class PoeFetchService {
  leagueName: string;
  private _headers = {
    'Content-Type': 'application/json',
    accept: '*/*',
    'User-Agent': 'NestJS',
  };

  constructor(private readonly _httpService: HttpService) {}

  async onModuleInit(): Promise<void> {
    try {
      this.leagueName = await this._takeLeagueName();
    } catch (err) {
      Logger.error(err);
    }
  }

  async _takeLeagueName(): Promise<string> {
    try {
      const observableResponse =
        await this._httpService.get<ResponseLeagueList>(
          'https://www.pathofexile.com/api/trade/data/leagues',
          {
            headers: this._headers,
          },
        );
      return (await lastValueFrom(observableResponse)).data.result[0].text;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error('UnknownException');
    }
  }

  async poeTradeDataItems(): Promise<PoeTradeDataItemsResponse> {
    try {
      const observableResponse =
        await this._httpService.get<PoeTradeDataItemsResponse>(
          'https://www.pathofexile.com/api/trade/data/items',
          {
            headers: this._headers,
          },
        );

      return (await lastValueFrom(observableResponse)).data;
    } catch (err) {
      Logger.error(err);
      if (err instanceof Error) throw new Error(err.message);
      throw new Error('UnknownException');
    }
  }

  async poeFirsRequest(query: string): Promise<PoeFirstResponse> {
    try {
      const response = await this._httpService.post<PoeFirstResponse>(
        `https://www.pathofexile.com/api/trade/search/${this.leagueName}`,
        {
          body: query,
        },
        {
          headers: this._headers,
        },
      );
      return (await lastValueFrom(response)).data;
    } catch (err) {
      Logger.error(err);
      if (err instanceof Error) throw new Error(err.message);
      throw new Error('UnknownException');
    }
  }

  async poeSecondRequest(
    resultIdsArrayString: string[],
    queryId: string,
  ): Promise<PoeSecondResponse> {
    try {
      const response = await this._httpService.get<PoeSecondResponse>(
        `https://www.pathofexile.com/api/trade/fetch/${resultIdsArrayString.join(
          ',',
        )}?query=${queryId}`,
        {
          headers: this._headers,
        },
      );
      return (await lastValueFrom(response)).data;
    } catch (err) {
      Logger.error(err);
      if (err instanceof Error) throw new Error(err.message);
      throw new Error('UnknownException');
    }
  }

  async makeARequestToAnyItem(query: string): Promise<{
    result: PoeSecondResult[];
    id: string;
  }> {
    try {
      const firstResponse = await this.poeFirsRequest(query);

      const { id, result, total } = firstResponse;
      const howToSkipFirstItems = total > 60 ? 3 : 0;
      const howMuchToTakeFromTheResult = total <= 9 ? total : 9;

      const totalTakeResultArray = result.slice(
        howToSkipFirstItems,
        howMuchToTakeFromTheResult,
      );
      const secondResponse = await this.poeSecondRequest(
        totalTakeResultArray,
        id,
      );
      return { result: [...secondResponse.result], id };
    } catch (err) {
      Logger.error(err);
      if (err instanceof Error) throw new Error(err.message);
      throw new Error('UnknownException');
    }
  }
}
