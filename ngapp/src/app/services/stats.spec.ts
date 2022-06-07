import { TestBed } from '@angular/core/testing';
import { StatsService } from 'app/services/stats';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StatsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: StatsService = TestBed.inject(StatsService);
    expect(service).toBeTruthy();
  });
});
