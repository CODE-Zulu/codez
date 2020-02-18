import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksComponent } from './stocks.component';
import { FormBuilder, FormGroup } from '@angular/forms';

describe('StocksComponent', () => {
  let component: StocksComponent;
  let fixture: ComponentFixture<StocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call fetch quote', () => {
    component.stockPickerForm = {valid: true} as FormGroup;
    const obj = {symbol: 'AAPL', period: '5y'}
    component.fetchQuote(obj);
    expect(component).toBeTruthy();
  });
});
