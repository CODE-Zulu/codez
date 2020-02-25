import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksComponent } from './stocks.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';

const stockPickerFormValues = {
  valid: true,
  value: {
    symbol: 'AAPL',
    toDate: 'Wed Feb 05 2020 00:00:00 GMT+0530 (India Standard Time)',
    fromDate: 'Wed Feb 05 2020 00:00:00 GMT+0530 (India Standard Time)'
  }
};

describe('StocksComponent', () => {
  let component: StocksComponent;
  let fixture: ComponentFixture<StocksComponent>;
  let debugElement: DebugElement;
  let priceFacadeSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [FormBuilder, PriceQueryFacade, Store],
      declarations: [StocksComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    const priceQuery = debugElement.injector.get(PriceQueryFacade);
    priceFacadeSpy = spyOn(priceQuery, 'fetchQuote');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('fetchQuote Method', () => {
    it('should call service method fetch quote', () => {
      component.stockPickerForm = stockPickerFormValues as FormGroup;
      component.fetchQuote();
      expect(priceFacadeSpy).toHaveBeenCalled();
      expect(priceFacadeSpy).toHaveBeenCalledWith(
        'AAPL',
        'max',
        stockPickerFormValues.value.toDate,
        stockPickerFormValues.value.fromDate
      );
    });
  });

  describe('validateRange Method', () => {
    it('should call valid range method', () => {
      component.stockPickerForm = stockPickerFormValues as FormGroup;
      const validateRangeSpy = spyOn(component, 'validateRange');
      const toDate = (stockPickerFormValues.value.toDate as unknown) as Date;
      component.validateRange(toDate);
      expect(validateRangeSpy).toHaveBeenCalled();
    });
  });

  describe('calculateMaxValueForToDate', () => {
    it('should call calculateMaxValueForToDate method', () => {
      component.stockPickerForm = stockPickerFormValues as FormGroup;
      const calculateMaxValueForToDateSpy = spyOn(
        component,
        'calculateMaxValueForToDate'
      );
      component.calculateMaxValueForToDate();
      expect(calculateMaxValueForToDateSpy).toHaveBeenCalled();
    });
  });
});
