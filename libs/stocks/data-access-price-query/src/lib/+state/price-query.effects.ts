import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  StocksAppConfig,
  StocksAppConfigToken
} from '@coding-challenge/stocks/data-access-app-config';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  FetchPriceQuery,
  PriceQueryActionTypes,
  PriceQueryFetched,
  PriceQueryFetchError
} from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { PriceQueryResponse } from './price-query.type';

@Injectable()
export class PriceQueryEffects {
  @Effect() loadPriceQuery$ = this.dataPersistence.fetch(
    PriceQueryActionTypes.FetchPriceQuery,
    {
      run: (action: FetchPriceQuery, state: PriceQueryPartialState) => {
        return this.httpClient
          .get(
            `${this.env.apiURL}/beta/stock/${action.symbol}/chart/${
              action.period
            }?token=${this.env.apiKey}`
          )
          .pipe(
            map((resp: PriceQueryResponse[]) => {
              const { toDate, fromDate } = action;
              const filteredResponse = this.filterByDateRange(
                resp,
                toDate,
                fromDate
              );
              return new PriceQueryFetched(
                filteredResponse as PriceQueryResponse[]
              );
            })
          );
      },

      onError: (action: FetchPriceQuery, error) => {
        return new PriceQueryFetchError(error);
      }
    }
  );

  constructor(
    @Inject(StocksAppConfigToken) private env: StocksAppConfig,
    private httpClient: HttpClient,
    private dataPersistence: DataPersistence<PriceQueryPartialState>
  ) {}

  /**
   * Method to filter out data values based on actual to and from date range
   * @param response: PriceQueryResponse
   * @param toDate To Date
   * @param fromDate From Date
   * @returns filtered response
   */
  filterByDateRange(
    response: PriceQueryResponse[],
    toDate: Date,
    fromDate: Date
  ): PriceQueryResponse[] {
    return response.filter(
      (stockValues: PriceQueryResponse) =>
        new Date(stockValues.date) <= toDate &&
        new Date(stockValues.date) >= fromDate
    );
  }
}
