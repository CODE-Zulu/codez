import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { combineLatest, Subject, concat } from 'rxjs';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, OnDestroy {
  private stockPickerForm: FormGroup;
  private symbol: string;
  private period: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  quotes$ = this.priceQuery.priceQueries$;

  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    combineLatest(
      this.stockPickerForm.get('symbol').valueChanges.pipe(debounceTime(400)),
      this.stockPickerForm.get('period').valueChanges
    ).pipe(takeUntil(this.ngUnsubscribe)).subscribe((formValues: string[]) => {
      const [symbol, period ] = formValues;
      this.fetchQuote({symbol,period});
    })
  }

  /**
   * Method to fetch Quote based on passed symbol and period value
   * @param value 
   */
  fetchQuote(value: FormValue): void {
      const { symbol, period } = value;
      if (symbol.length && period.length) {
      this.priceQuery.fetchQuote(symbol, period);
    }
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

class FormValue {
  symbol: string;
  period: string
}

