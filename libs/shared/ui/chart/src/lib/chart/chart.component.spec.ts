import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartComponent } from './chart.component';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GoogleChartsModule } from 'angular-google-charts';

    const data = [[ "2015-02-23", 135],  [ "2019-02-23", 136]];

describe('ChartComponent', () => {


  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GoogleChartsModule],
      declarations: [ ChartComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.data$ = of(data);
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the passed chart data value', (done) => {
    component.data$.subscribe(value=>
      expect(value).toEqual(data));
      done();
  });

  it('should get new passed chart data value', (done) => {
    component.data$ = of([]);
    component.data$.subscribe(value=>
      expect(value).toEqual([]));
      done();
  });
});
