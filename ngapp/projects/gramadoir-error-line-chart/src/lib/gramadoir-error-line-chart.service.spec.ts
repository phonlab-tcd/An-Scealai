import { TestBed } from '@angular/core/testing';

import { GramadoirErrorLineChartService } from './gramadoir-error-line-chart.service';

describe('GramadoirErrorLineChartService', () => {
  let service: GramadoirErrorLineChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GramadoirErrorLineChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
