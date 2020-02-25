import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksComponent } from './stocks.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { Store, StoreModule } from '@ngrx/store';

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
    it('should call fetch quote', () => {
      const obj = { symbol: 'AAPL', period: '5y' };
      component.fetchQuote(obj);
      expect(priceFacadeSpy).toHaveBeenCalled();
      expect(priceFacadeSpy).toHaveBeenCalledWith('AAPL', '5y');
    });
    it('should not call fetch quote if symbol is empty', () => {
      const obj = { symbol: '', period: '5y' };
      component.fetchQuote(obj);
      expect(priceFacadeSpy).not.toHaveBeenCalled();
    });
    it('should not call fetch quote if period is empty', () => {
      const obj = { symbol: 'AAPL', period: '' };
      component.fetchQuote(obj);
      expect(priceFacadeSpy).not.toHaveBeenCalled();
    });
  });
});
