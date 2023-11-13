import { TestBed } from '@angular/core/testing';

import { SynthesisCacheService } from './synthesis-cache.service';

describe('SynthesisCacheService', () => {
  let service: SynthesisCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SynthesisCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
