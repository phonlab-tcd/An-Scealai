import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GramadoirErrorLineChartComponent } from './gramadoir-error-line-chart.component';

describe('GramadoirErrorLineChartComponent', () => {
  let component: GramadoirErrorLineChartComponent;
  let fixture: ComponentFixture<GramadoirErrorLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GramadoirErrorLineChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GramadoirErrorLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
