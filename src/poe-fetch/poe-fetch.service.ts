import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, lastValueFrom } from 'rxjs';
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
  private readonly logger = new Logger(PoeFetchService.name);

  constructor(private readonly _httpService: HttpService) {}

  async onModuleInit(): Promise<void> {
    try {
      this.leagueName = await this._takeLeagueName();
    } catch (err) {
      this.logger.error(err);
    }
  }

  async _takeLeagueName(): Promise<string> {
    try {
      const observableResponse = this._httpService.get<ResponseLeagueList>(
        'https://www.pathofexile.com/api/trade/data/leagues',
        this.httpOptions(),
      );
      return (await lastValueFrom(observableResponse)).data.result.find(
        (el) =>
          !el.id.toLowerCase().includes('standard') &&
          !el.id.toLowerCase().includes('hardcore'),
      ).text;
    } catch (err) {
      if (err instanceof Error) throw err.message;
      throw 'UnknownException';
    }
  }

  async poeTradeDataItems(): Promise<PoeTradeDataItemsResponse> {
    try {
      const observableResponse = this._httpService
        .get<PoeTradeDataItemsResponse>(
          'https://www.pathofexile.com/api/trade/data/items',
          this.httpOptions(),
        )
        .pipe(
          catchError((e) => {
            this.logger.error(e.response.data);
            throw e.message;
          }),
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
      const { data } = await firstValueFrom(
        this._httpService
          .post<PoeFirstResponse>(
            `https://www.pathofexile.com/api/trade/search/${this.leagueName}`,
            JSON.parse(query),
            this.httpOptions(),
          )
          .pipe(
            catchError((e) => {
              this.logger.error(e.response.data);
              throw e.message;
            }),
          ),
      );
      return data;
    } catch (err) {
      Logger.error(err);
      if (err instanceof Error) throw err.message;
      throw 'UnknownException';
    }
  }

  async poeSecondRequest(
    resultIdsArrayString: string[],
    queryId: string,
  ): Promise<PoeSecondResponse> {
    try {
      const response = await this._httpService
        .get<PoeSecondResponse>(
          `https://www.pathofexile.com/api/trade/fetch/${resultIdsArrayString.join(
            ',',
          )}?query=${queryId}`,
          this.httpOptions(),
        )
        .pipe(
          catchError((e) => {
            this.logger.error(e.response.data);
            throw e.message;
          }),
        );

      return (await lastValueFrom(response)).data;
    } catch (err) {
      if (err instanceof Error) throw err.message;
      throw 'UnknownException';
    }
  }

  async makeARequestToAnyItem(query: string): Promise<{
    result: PoeSecondResult[];
    id: string;
  }> {
    try {
      const firstResponse = await this.poeFirsRequest(query); //?
      const { id, result, total } = firstResponse;
      if (total === 0) {
        return Promise.reject(new Error('No items found'));
      }
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
      if (err instanceof Error) throw err.message;
      throw 'UnknownException';
    }
  }

  private readonly httpOptions = () => {
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'NestJS',
      access: '*/*',
    };

    return { headers };
  };
}
