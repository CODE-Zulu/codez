import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { combineLatest, Subject, concat } from 'rxjs';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, OnDestroy {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  private ngUnsubscribe: Subject<void>;

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
      toDate: [null, Validators.required],
      fromDate: [null, Validators.required]
    });
    this.ngUnsubscribe = new Subject<void>();
  }

  ngOnInit() {
  }

  /**
   * Method to fetch Quote based on passed symbol and period value
   */
  public fetchQuote(): void {
    if (this.stockPickerForm.valid) {
      const period = 'max';
      const { symbol, toDate, fromDate } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, period , toDate, fromDate );
    }
  }

  /**
   * Method to calculate max value to be fed to Date Controls
   */
  public calculateMaxValueForToDate(): Date {
    return new Date();
  }
  
  /**
   * Method to validate date range and set default value for to date if invalid
   * @param toDate
   */
  public validateRange(toDate: Date): void{
    const { fromDate } = this.stockPickerForm.value;
    if (fromDate && (toDate < fromDate)) {
      this.stockPickerForm.controls['toDate'].setValue(fromDate);

    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
