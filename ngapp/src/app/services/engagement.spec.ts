import { TestBed } from '@angular/core/testing';
import { EngagementService } from 'app/services/engagement';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EngagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: EngagementService = TestBed.inject(EngagementService);
    expect(service).toBeTruthy();
  });
});
