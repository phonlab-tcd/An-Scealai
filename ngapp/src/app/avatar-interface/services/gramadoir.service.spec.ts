import { TestBed } from '@angular/core/testing';

import { GramadoirService } from './gramadoir.service';

describe('GramadoirService', () => {
  let service: GramadoirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GramadoirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
